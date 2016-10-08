export default function (file) {
    if (file.properties) {
        const {songArtist, songTitle} = file.properties;
        let out = "";
        if (songArtist) out += songArtist + " - ";
        if (songTitle) {
            out += songTitle;
        } else {
            out += file.name
        }
        return out;
    } 
    return file.name;
}