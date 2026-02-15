import React, { useState, useEffect } from 'react';
import { encodeVigenere, decodeVigenere } from '../ciphers/vigenere';

const CipherForm = (props) => {
    // States
    const [alphabet, setAlphabet] = useState("abcdefghijklmnopqrstuvwxyz");
    const [text, setText] = useState("The quick brown fox jumps over the lazy dog.");
    const [key, setKey] = useState("cipher");
    const [keyMode, setKeyMode] = useState("repeat"); // repeat or autoKey
    const [mode, setMode] = useState("encode"); // encode or decode
    const [result, setResult] = useState("");
    const [prevResult, setPrevResult] = useState(""); // previous result for invalid alphabet
    const [copyAlert, setCopyAlert] = useState(false);
    const [isEdited, setIsEdited] = useState(false);
    const [isEditedKey, setIsEditedKey] = useState(false);

    // Helper: check for duplicate characters (case-insensitive)
    const hasDuplicates = (str) => {
        const chars = str.toUpperCase().split("");
        return new Set(chars).size !== chars.length;
    };

    // Live calculation effect
    useEffect(() => {
        if (!alphabet || hasDuplicates(alphabet)) {
            // Stop calculation if duplicates exist
            setResult(prevResult);
            return;
        }

        if (!text || !key) {
            setResult("");
            setPrevResult("");
            return;
        }

        let newResult = mode === "encode"
            ? encodeVigenere(text, key, keyMode, alphabet)
            : decodeVigenere(text, key, keyMode, alphabet);

        setResult(newResult);
        setPrevResult(newResult);

    }, [text, key, mode, keyMode, alphabet, prevResult]);

    // Copy result
    const handleCopy = () => {
        navigator.clipboard.writeText(result);
        setCopyAlert(true);

        setTimeout(() => {
            setCopyAlert(false);
        }, 1000);
    };

    return (
        <div className="container my-4">
            <h3 className="mb-4 text-center fw-bold">{props.cipherName}</h3>
            <div className="row">
                {/* Input Section */}
                <div className="col-md-4 mb-3">
                    <label className="form-label fs-4 fw-bold">{mode === 'encode' ? 'Plain Text' : 'Cipher Text'}</label>
                    <textarea className="form-control cipher-text" rows="8" value={text} onChange={(e) => { setText(e.target.value); setIsEdited(true); }} onFocus={(e) => { if (!isEdited) e.target.select(); }} placeholder="Enter text here..."></textarea>
                </div>

                {/* Key / Mode / Alphabet Section */}
                <div className="col-md-4 mb-3 d-flex flex-column justify-content-between">
                    <div>
                        <label className="form-label fs-4 fw-bold">Key</label>
                        <input type="text" className="form-control mb-3 cipher-text fw-bold" value={key} onChange={(e) => { setKey(e.target.value); setIsEditedKey(true); }} onFocus={(e) => { if (!isEditedKey) e.target.select(); }} placeholder="Enter key..."></input>

                        <label className="form-label fw-bold">Key Mode</label>
                        <div className="d-flex mb-3">
                            <button className={`btn me-2 fw-bold rounded-pill ${keyMode === 'repeat' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setKeyMode('repeat')}>Repeat</button>
                            <button className={`btn fw-bold rounded-pill ${keyMode === 'autoKey' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setKeyMode('autoKey')}>AutoKey</button>
                        </div>

                        <label className="form-label fw-bold">Alphabet</label>
                        <input type="text" className="form-control fw-bold cipher-text" value={alphabet} onChange={e => setAlphabet(e.target.value)}></input>
                        {hasDuplicates(alphabet) && <small className="text-danger">Alphabet contains duplicate letters. Fix to continue calculation.</small>}
                    </div>

                    <div className="d-flex mt-3">
                        <button className={`btn fw-bold me-2 rounded-pill ${mode === 'encode' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setMode('encode')}>Encode</button>
                        <button className={`btn fw-bold rounded-pill ${mode === 'decode' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setMode('decode')}>Decode</button>
                    </div>
                </div>

                {/* Output Section */}
                <div className="col-md-4 mb-3">
                    <label className="form-label fs-4 fw-bold">{mode === 'encode' ? 'Cipher Text' : 'Plain Text'}</label>
                    <textarea className="form-control cipher-text" rows="8" value={result} onFocus={(e) => e.target.select()} readOnly placeholder="Result will appear here..."></textarea>
                    <div className="text-end mt-2"><button className="btn btn-primary fw-bold" onClick={handleCopy}>Copy</button></div>
                </div>

                {copyAlert && (
                    <div className="alert alert-success mt-2 py-2 text-center">
                        Copied to clipboard!
                    </div>
                )}
            </div>
        </div>
    );
};

export default CipherForm;
