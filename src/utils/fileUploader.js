import EventEmmiter from 'eventemitter3';

class FileUploader extends EventEmmiter {
    constructor(file, parents) {
        super();
        this.file = file;
        this.progress = 0;
        this.finished = false;
        this.parents = parents;
    }
    upload() {
        if(this.finished) {
            this.emit("finish");
            return
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            if(this.canceled) return;

            const bin = window.btoa(e.target.result);

            const boundary = '-------314159265358979323846';
            const delimiter = `\r\n--${boundary}\r\n`;
            const closeDelimiter = `\r\n--${boundary}--`;
            const contentType = this.file.type;

            const metadata = {
                name: this.file.name,
                mimeType: contentType,
                parents: [].concat(this.parents)
            };

            const multipartRequestBody =
                `${delimiter}content-type: application/json\r\n\r\n` +
                JSON.stringify(metadata) +
                `${delimiter}` +
                `content-transfer-encoding: base64\r\n`+
                `content-type: ${contentType}\r\n\r\n` +
                bin + 
                closeDelimiter;

            const request = new XMLHttpRequest();
            const oauth2Token = gapi.auth.getToken();
            request.open("post", "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart");
            request.setRequestHeader("Authorization", `Bearer ${oauth2Token.access_token}`);
            request.setRequestHeader("Content-Type", `multipart/form-data; boundary="${boundary}"`);

            //progress listener
            request.addEventListener("progress", (e) => {
                if(e.lengthComputable && !this.canceled) {
                    this.progress = e.loaded / e.total;
                    this.emit("progress", this.progress);
                }
            });
            //finish listener
            request.addEventListener("load", (e) => {
                if(!this.canceled) {
                    if(request.status == 200){
                        this.finished = true;
                        this.emit("finish", JSON.parse(request.responseText));
                    }else 
                        this.emit("error", e);
                }
            });
            //fail listener
            request.addEventListener("error", (e) => {
                if(!this.canceled) {
                    this.emit("error", e);
                }
            });

            request.send(multipartRequestBody);
            this.request = request;
        }
        reader.readAsBinaryString(this.file);
    }
    cancel() {
        this.canceled = true;
        if(this.request) this.request.abort();
    }
    fileName() {
        return this.file.name
    }
    fileProgress() {
        return this.progress;
    }
    isFinished() {
        return this.finished;
    }
}

export default FileUploader;