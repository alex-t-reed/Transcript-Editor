const editor = document.getElementById("editor"),
    transcript = document.getElementById("transcript")

function addPrefix(e) {
    editor.value += e, updateTranscript(editor.value)
    editor.focus()
}

function updateTranscript(e) {
    let t = e.split("\n"),
        r = "";
    for (let a = 0; a < t.length; a++) {
        let i = t[a].trim();
        i.startsWith("I:") && /\[\d{1,2}:\d{2}\]/.test(i) ? r += "<b>" + i + "</b><br><br>" : i.startsWith("I:") ? r += i + "<br><br>" : i.startsWith("P:") ? r += i + "<br><br>" : r += i
    }
    transcript.innerHTML = r
}

function addBrackets() {
    let e = document.getElementById("editor"),
        t = e.selectionStart,
        r = e.selectionEnd,
        a = e.value;
    e.value = a.substring(0, t) + "[]" + a.substring(r), e.selectionStart = t + 1, e.selectionEnd = t + 1, e.focus()
}


editor.addEventListener("keydown", e => {
    if ("?" === e.key) {
        editor.value.trim().split("\n").pop(), editor.value += prefix + " []\n", editor.focus();
        let t = editor.value.length - 2;
        editor.selectionStart = t, editor.selectionEnd = t, updateTranscript(editor.value), e.preventDefault()
    }
}), editor.addEventListener("input", e => {
    updateTranscript(editor.value)
}), updateTranscript(editor.value);
const audioPlayer = document.getElementById("audioPlayer"),
    playBtn = document.getElementById("playBtn"),
    pauseBtn = document.getElementById("pauseBtn"),
    speedSelect = document.getElementById("speedSelect"),
    audioFile = document.getElementById("audioFile"),
    frwdBtn = document.getElementById("frwd5"),
    bckwdBtn = document.getElementById("bckwd5");
playBtn.addEventListener("click", () => {
    audioPlayer.play()
}), pauseBtn.addEventListener("click", () => {
    audioPlayer.pause()
}), frwdBtn.addEventListener("click", () => {
    audioPlayer.currentTime += 5
}), bckwdBtn.addEventListener("click", () => {
    audioPlayer.currentTime -= 5
}), speedSelect.addEventListener("change", () => {
    audioPlayer.playbackRate = speedSelect.value
}), audioFile.addEventListener("change", () => {
    let e = audioFile.files[0],
        t = new FileReader;
    t.addEventListener("load", () => {
        audioPlayer.src = t.result
    }), t.readAsDataURL(e)
});
const getTime = document.getElementById("getTime");

function formatTime(e) {
    let t = String(Math.floor(e / 60)).padStart(2, "0"),
        r = String(Math.floor(e % 60)).padStart(2, "0");
    return `${t}:${r}`
}
getTime.addEventListener("click", () => {
    let start = editor.selectionStart
    let end = editor.selectionEnd
    let textTwo = editor.value.substring(editor.selectionEnd);
    let textOne = editor.value.substring(editor.selectionEnd, 0);
    editor.value = textOne + "[" + formatTime(audioPlayer.currentTime) + "]" + textTwo, editor.setSelectionRange(end + 7, end + 7), updateTranscript(editor.value)
}), localStorage.getItem("editorValue") && (editor.value = localStorage.getItem("editorValue"), updateTranscript(editor.value)), editor.addEventListener("input", e => {
    localStorage.setItem("editorValue", editor.value), updateTranscript(editor.value)
});

