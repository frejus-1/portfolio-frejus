import { useEffect, useState } from "react";

function TypingText({ words = [] }) {
    const [wordIndex, setWordIndex] = useState(0);
    const [text, setText] = useState("");
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        if (!words.length) {
            return;
        }

        const currentWord = words[wordIndex];

        let delay = 280;

        // Pause lorsque le mot est complètement écrit
        if (!deleting && text === currentWord) {
            delay = 2500;
        }

        // Suppression plus lente
        else if (deleting) {
            delay = 120;
        }

        const timer = setTimeout(() => {
            if (!deleting) {
                const nextText = currentWord.slice(
                    0,
                    text.length + 1
                );

                setText(nextText);

                if (nextText === currentWord) {
                    setDeleting(true);
                }
            } else {
                const nextText = currentWord.slice(
                    0,
                    text.length - 1
                );

                setText(nextText);

                if (nextText === "") {
                    setDeleting(false);

                    setWordIndex(
                        (previous) =>
                            (previous + 1) % words.length
                    );
                }
            }
        }, delay);

        return () => {
            clearTimeout(timer);
        };
    }, [text, deleting, wordIndex, words]);

    return (
        <span className="typing-text">
            <span className="typing-value">
                {text}
            </span>

            <span
                className="typing-cursor"
                aria-hidden="true"
            >
                |
            </span>
        </span>
    );
}

export default TypingText;