import fs from "fs";

export const deleteServerImg = (imagePath: string) => {
  try {
    // Delete the image from the server
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
    return true;
  } catch (error) {
    console.error("Error deleting image:", error);
    return false;
  }
};
