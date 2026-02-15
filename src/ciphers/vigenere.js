// Helper: Check if character is in the alphabet
const isInAlphabet = (char, alphabet) => alphabet.toUpperCase().includes(char.toUpperCase());

// Helper: Shift a character by a given amount within the alphabet
const shiftChar = (char, shift, alphabet, encode = true) => {
    const upperAlphabet = alphabet.toUpperCase();
    if (!isInAlphabet(char, alphabet)) return char;

    const isUpper = char === char.toUpperCase();
    const charIndex = upperAlphabet.indexOf(char.toUpperCase());
    const newIndex = encode
        ? (charIndex + shift) % upperAlphabet.length
        : (charIndex - shift + upperAlphabet.length) % upperAlphabet.length;

    const resultChar = upperAlphabet[newIndex];
    return isUpper ? resultChar : resultChar.toLowerCase();
};

// Helper: Format the key for Repeat mode
const formatRepeatKey = (text, key, alphabet) => {
    const upperAlphabet = alphabet.toUpperCase();
    key = key.toUpperCase().replace(new RegExp(`[^${upperAlphabet}]`, "g"), "");
    let formattedKey = "";
    let keyIndex = 0;

    for (const char of text) {
        if (isInAlphabet(char, alphabet)) {
            formattedKey += key[keyIndex % key.length];
            keyIndex++;
        } else {
            formattedKey += char; // keep punctuation/numbers
        }
    }
    return formattedKey;
};

// Encode Vigenère cipher
export const encodeVigenere = (text, key, keyMode = "repeat", alphabet = "abcdefghijklmnopqrstuvwxyz") => {
    if (!text || !key) return "";

    if (keyMode === "repeat") {
        const formattedKey = formatRepeatKey(text, key, alphabet);
        return [...text].map((char, i) =>
            shiftChar(char, alphabet.toUpperCase().indexOf(formattedKey[i].toUpperCase()), alphabet, true)
        ).join("");
    }

    // AutoKey encode
    const upperAlphabet = alphabet.toUpperCase();
    key = key.toUpperCase().replace(new RegExp(`[^${upperAlphabet}]`, "g"), "");
    let result = "";
    let autoKey = key;

    for (const char of text) {
        if (isInAlphabet(char, alphabet)) {
            const shift = upperAlphabet.indexOf(autoKey[0]);
            const encodedChar = shiftChar(char, shift, alphabet, true);
            result += encodedChar;
            autoKey += char.toUpperCase(); // append plaintext letter
            autoKey = autoKey.slice(1); // slide key
        } else {
            result += char;
        }
    }
    return result;
};

// Decode Vigenère cipher
export const decodeVigenere = (text, key, keyMode = "repeat", alphabet = "abcdefghijklmnopqrstuvwxyz") => {
    if (!text || !key) return "";

    if (keyMode === "repeat") {
        const formattedKey = formatRepeatKey(text, key, alphabet);
        return [...text].map((char, i) =>
            shiftChar(char, alphabet.toUpperCase().indexOf(formattedKey[i].toUpperCase()), alphabet, false)
        ).join("");
    }

    // AutoKey decode
    const upperAlphabet = alphabet.toUpperCase();
    key = key.toUpperCase().replace(new RegExp(`[^${upperAlphabet}]`, "g"), "");
    let result = "";
    let currentKey = key;

    for (const char of text) {
        if (isInAlphabet(char, alphabet)) {
            const shift = upperAlphabet.indexOf(currentKey[0]);
            const decodedChar = shiftChar(char, shift, alphabet, false);
            result += decodedChar;
            currentKey = currentKey.slice(1) + decodedChar.toUpperCase(); // slide key with decoded letter
        } else {
            result += char;
        }
    }
    return result;
};
