export function chooseRandElem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

export function isPhotoFile(str) {
    if (!str) return false;
    return ["png", "jpg", "jpeg", "gif", ".webp"].indexOf(str.split(".")[1]) != -1;
}