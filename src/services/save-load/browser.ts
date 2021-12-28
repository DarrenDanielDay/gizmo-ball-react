import { isMapItem } from "../../core/map-items/checker";
import { die } from "../../core/physics/utils";
import type { ISaveLoadService } from "../schema";

declare global {
  interface Window {
    showOpenFilePicker(options?: {
      multiple?: boolean;
      excludeAcceptAllOption?: boolean;
      types?: {
        description?: string;
        accept?: Record<string, string[]>;
      }[];
    }): Promise<FileSystemFileHandle[]>;
  }
  interface FileSystemFileHandle {
    getFile(): Promise<File>;
  }
}

export const browserSaveLoadService: ISaveLoadService = {
  async save(items) {
    const json = JSON.stringify(items);
    const blob = new Blob([json], {
      type: "text/plain",
    });
    const a = document.createElement("a");
    a.setAttribute("download", "gizmoball-profile.json");
    a.setAttribute("href", URL.createObjectURL(blob));
    a.click();
  },
  async load() {
    const json =
      typeof window.showOpenFilePicker === "function"
        ? await getFileByNonStandardAPI()
        : await getFileContentByInputElement();
    try {
      const parsed: unknown = JSON.parse(json);
      if (Array.isArray(parsed) && parsed.every((item) => isMapItem(item))) {
        return parsed;
      }
      return Promise.reject("Invalid format.");
    } catch (error) {
      return Promise.reject("Invalid json.");
    }
  },
};

const getFileByNonStandardAPI = async (): Promise<string> => {
  try {
    const handles = await window.showOpenFilePicker({
      multiple: false,
      excludeAcceptAllOption: true,
      types: [
        {
          description: "gizmoball profile",
          accept: {
            "application/json": [".json"],
          },
        },
      ],
    });
    const handle = handles[0];
    if (!handle) {
      return die("No handle.");
    }
    const file = await handle.getFile();
    return await file.text();
  } catch (error) {
    if (error instanceof DOMException) {
      return die("User canceled.");
    }
    throw error;
  }
};

const getFileContentByInputElement = async () => {
  return await new Promise<string>((resolve, reject) => {
    const cleanUp = () => {
      input.removeEventListener("change", handleChange);
    };
    const fail = (message?: string) => {
      cleanUp();
      reject(message);
    };
    const finish = (text: string) => {
      cleanUp();
      resolve(text);
    };
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", ".json");
    const handleChange = () => {
      if (input.files) {
        const file = input.files.item(0);
        if (file) {
          const reader = new FileReader();
          reader.addEventListener("loadend", () => {
            const currentResult = reader.result;
            if (typeof currentResult === "string") {
              finish(currentResult);
            } else {
              fail("Error occured when read file.");
            }
          });
          reader.readAsText(file);
        } else {
          fail("No file selected");
        }
      }
    };
    input.addEventListener("change", handleChange);
    input.click();
  });
};
