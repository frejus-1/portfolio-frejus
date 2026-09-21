import { useEffect, useState } from "react";
import { useLanguage } from "../context/useLanguage";

function Terminal({ isOpen, onClose }) {
    const { t } = useLanguage();

    const getInitialHistory = () => [
        {
            type: "system",
            text: t("terminal.welcome"),
        },
        {
            type: "system",
            text: t("terminal.instruction"),
        },
    ];

    const [command, setCommand] = useState("");
    const [history, setHistory] = useState(
        getInitialHistory
    );

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const handleEscape = (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener(
            "keydown",
            handleEscape
        );

        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener(
                "keydown",
                handleEscape
            );

            document.body.style.overflow = "";
        };
    }, [isOpen, onClose]);

    const executeCommand = (value) => {
        const commandValue = value
            .trim()
            .toLowerCase();

        if (!commandValue) {
            return;
        }

        if (commandValue === "clear") {
            setHistory([]);
            setCommand("");
            return;
        }

        const commands = t("terminal.commands");

        const commandData =
            commands?.[commandValue];

        setHistory((previous) => [
            ...previous,

            {
                type: "command",
                text: commandValue,
            },

            {
                type: commandData
                    ? "output"
                    : "error",

                text: commandData
                    ? commandData.output.join("\n")
                    : `${t(
                          "terminal.unknownCommand"
                      )} : ${commandValue}`,
            },
        ]);

        setCommand("");
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        executeCommand(command);
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div
            className="terminal-modal"
            role="dialog"
            aria-modal="true"
            aria-label={t("terminal.title")}
            onMouseDown={(event) => {
                if (
                    event.target ===
                    event.currentTarget
                ) {
                    onClose();
                }
            }}
        >
            <div className="terminal-modal-window">

                <div className="terminal-header">

                    <div className="terminal-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>

                    <span className="terminal-title">
                        {t(
                            "terminal.windowTitle"
                        )}
                    </span>

                    <button
                        type="button"
                        className="terminal-close"
                        onClick={onClose}
                        aria-label={t(
                            "terminal.close"
                        )}
                    >
                        ×
                    </button>

                </div>

                <div className="terminal-body">

                    {history.map(
                        (item, index) => (
                            <div
                                key={`${item.type}-${index}`}
                                className={`terminal-line terminal-${item.type}`}
                            >
                                {item.type ===
                                    "command" && (
                                    <span className="terminal-prompt">
                                        $
                                    </span>
                                )}

                                <span>
                                    {item.text
                                        .split(
                                            "\n"
                                        )
                                        .map(
                                            (
                                                line,
                                                lineIndex
                                            ) => (
                                                <span
                                                    key={
                                                        lineIndex
                                                    }
                                                    className="terminal-output-line"
                                                >
                                                    {
                                                        line
                                                    }
                                                </span>
                                            )
                                        )}
                                </span>
                            </div>
                        )
                    )}

                    <form
                        className="terminal-input-line"
                        onSubmit={
                            handleSubmit
                        }
                    >
                        <span className="terminal-prompt">
                            $
                        </span>

                        <input
                            type="text"
                            value={command}
                            onChange={(event) =>
                                setCommand(
                                    event.target
                                        .value
                                )
                            }
                            autoComplete="off"
                            spellCheck="false"
                            autoFocus
                            placeholder={t(
                                "terminal.placeholder"
                            )}
                            aria-label={t(
                                "terminal.placeholder"
                            )}
                        />
                    </form>

                </div>
            </div>
        </div>
    );
}

export default Terminal;