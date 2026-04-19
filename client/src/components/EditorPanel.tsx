import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface EditorPanelProps {
    selectedElement: {
        tagName: string;
        className: string;
        text: string;
        src?: string;
        styles: {
            padding: string;
            margin: string;
            backgroundColor: string;
            color: string;
            fontSize: string;
            backgroundImage?: string;
        };
    } | null;
    onUpdate: (updates: any) => void;
    onClose: () => void;
}

const EditorPanel = ({
    selectedElement,
    onUpdate,
    onClose,
}: EditorPanelProps) => {
    const [values, setValues] = useState<typeof selectedElement>(selectedElement);
    // Removed unused chosenFileName and setChosenFileName
    const [bgFileName, setBgFileName] = useState<string>("");
    useEffect(() => {
        setValues(selectedElement);
    }, [selectedElement]);

    if (!selectedElement || !values) return null;

    const handleChange = (field: string, value: string) => {
        if (!values) return;
        const newValues = { ...values, [field]: value };
        if (field in (values.styles || {})) {
            newValues.styles = { ...values.styles, [field]: value };
        }
        setValues(newValues);
        onUpdate({ [field]: value });
    };

    const handleStyleChange = (styleName: string, value: string) => {
        if (!values) return;
        const newStyles = { ...values.styles, [styleName]: value };
        setValues({ ...values, styles: newStyles });
        onUpdate({ styles: { [styleName]: value } });
    };

    return (
        <div className="absolute top-4 right-4 w-80 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50 animate-fade-in fade-in">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-800">Edit Element</h3>
                <button
                    onClick={onClose}
                    className="p-1 hover:bg-gray-100 rounded-full"
                    aria-label="Close editor panel"
                >
                    <X className="w-4 h-4 text-gray-500" />
                </button>
            </div>

            <div className="space-y-4 text-black">
                {/* Background image upload/remove for non-img elements with backgroundImage */}
                {selectedElement && values && selectedElement.tagName !== "img" && (
                    <div className="space-y-2">
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                            Background Image
                        </label>
                        <div className="flex flex-col gap-2">
                            <div className="w-full h-32 flex items-center justify-center border rounded bg-gray-100">
                                {values.styles && values.styles.backgroundImage && values.styles.backgroundImage !== "none" ? (
                                    <img
                                        src={values.styles.backgroundImage.replace(/^url\(["']?|["']?\)$/g, "").replace(/^url\(["']?|["']?\)$/g, "").replace(/^url\(["']?|["']?\)$/g, "").replace(/url\(["']?|["']?\)/g, "").replace(/\)$/g, "").replace(/\"/g, "").replace(/'/g, "")}
                                        alt="Background"
                                        className="max-h-32 max-w-full object-cover"
                                    />
                                ) : (
                                    <span className="text-xs text-gray-400">No background image</span>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <label
                                    className={`block w-full text-xs mt-1 border-dashed border-2 rounded px-2 py-1 cursor-pointer transition-colors ${!values.styles || !values.styles.backgroundImage || values.styles.backgroundImage === "none" ? "border-indigo-500 bg-indigo-50" : "border-gray-300 bg-white"}`}
                                    htmlFor="bg-upload-input"
                                >
                                    <span className="text-indigo-700 font-medium">Choose File</span>
                                    <input
                                        id="bg-upload-input"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={e => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;
                                            setBgFileName(file.name);
                                            const reader = new FileReader();
                                            reader.onload = (ev) => {
                                                const url = `url('${ev.target?.result as string}')`;
                                                setValues({ ...values, styles: { ...values.styles, backgroundImage: url } });
                                                onUpdate({ styles: { backgroundImage: url } });
                                            };
                                            reader.readAsDataURL(file);
                                        }}
                                    />
                                </label>
                                {/* Show chosen file name if present and bg not removed */}
                                {bgFileName && values.styles && values.styles.backgroundImage && values.styles.backgroundImage !== "none" && (
                                    <span className="text-xs text-gray-600 mt-1">{bgFileName}</span>
                                )}
                                {values.styles && values.styles.backgroundImage && values.styles.backgroundImage !== "none" && (
                                    <button
                                        type="button"
                                        className="px-2 py-1 text-xs rounded bg-red-100 text-red-600 border border-red-200 hover:bg-red-200"
                                        onClick={() => {
                                            setValues({ ...values, styles: { ...values.styles, backgroundImage: "none" } });
                                            onUpdate({ styles: { backgroundImage: "none" } });
                                            setBgFileName("");
                                        }}
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Image upload/remove for <img> elements */}
                {selectedElement?.tagName === "img" && values && (
                    <div className="space-y-2">
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                            Image
                        </label>
                        <div className="flex flex-col gap-2">
                            <div className="w-full h-32 flex items-center justify-center border rounded bg-gray-100">
                                {values.src ? (
                                    <img
                                        src={values.src}
                                        alt="Current"
                                        className="max-h-32 max-w-full object-contain"
                                    />
                                ) : (
                                    <span className="text-xs text-gray-400">No image selected</span>
                                )}
                            </div>
                            <div className="flex gap-2 items-center">
                                <label
                                    className={`block w-full text-xs mt-1 border-dashed border-2 rounded px-2 py-1 cursor-pointer transition-colors ${!values.src ? "border-indigo-500 bg-indigo-50" : "border-gray-300 bg-white"}`}
                                    htmlFor="img-upload-input"
                                >
                                    <span className="text-indigo-700 font-medium">Choose File</span>
                                    <input
                                        id="img-upload-input"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={e => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;
                                            const reader = new FileReader();
                                            reader.onload = (ev) => {
                                                setValues({ ...values, src: ev.target?.result as string });
                                                onUpdate({ src: ev.target?.result });
                                            };
                                            reader.readAsDataURL(file);
                                        }}
                                    />
                                </label>
                                {values.src && (
                                    <button
                                        type="button"
                                        className="px-2 py-1 text-xs rounded bg-red-100 text-red-600 border border-red-200 hover:bg-red-200 ml-2"
                                        onClick={() => {
                                            setValues({ ...values, src: "" });
                                            onUpdate({ src: "" });
                                        }}
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                        Text Content
                    </label>
                    <textarea
                        value={values.text}
                        onChange={(e) => handleChange("text", e.target.value)}
                        className="w-full text-sm p-2 border border-gray-400 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none min-h-20 transition-colors"
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                        Class Name
                    </label>
                    <input
                        type="text"
                        value={values.className || ""}
                        onChange={(e) =>
                            handleChange("className", e.target.value)
                        }
                        className="w-full text-sm p-2 border border-gray-400 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
                    />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                            Padding
                        </label>
                        <input
                            type="text"
                            value={values.styles.padding}
                            onChange={(e) =>
                                handleStyleChange("padding", e.target.value)
                            }
                            className="w-full text-sm p-2 border border-gray-400 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                            Margin
                        </label>
                        <input
                            type="text"
                            value={values.styles.margin}
                            onChange={(e) =>
                                handleStyleChange("margin", e.target.value)
                            }
                            className="w-full text-sm p-2 border border-gray-400 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                            Font Size
                        </label>
                        <input
                            type="text"
                            value={values.styles.fontSize}
                            onChange={(e) =>
                                handleStyleChange("fontSize", e.target.value)
                            }
                            className="w-full text-sm p-2 border border-gray-400 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                            Background Color
                        </label>
                        <div className="flex items-center gap-2 border border-gray-400 rounded-md p-1">
                            <input
                                type="color"
                                value={
                                    values.styles.backgroundColor ===
                                    "rgba(0, 0, 0, 0)"
                                        ? "#ffffff"
                                        : values.styles.backgroundColor
                                }
                                onChange={(e) =>
                                    handleStyleChange(
                                        "backgroundColor",
                                        e.target.value
                                    )
                                }
                                className="w-6 h-6 cursor-pointer"
                            />
                            <span className="text-xs text-gray-400 truncate">
                                {values.styles.backgroundColor}
                            </span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                            Text Color
                        </label>
                        <div className="flex items-center gap-2 border border-gray-400 rounded-md p-1">
                            <input
                                type="color"
                                value={values.styles.color}
                                onChange={(e) =>
                                    handleStyleChange("color", e.target.value)
                                }
                                className="w-6 h-6 cursor-pointer"
                            />
                            <span className="text-xs text-gray-400 truncate">
                                {values.styles.color}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditorPanel;
