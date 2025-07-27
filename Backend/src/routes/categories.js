import express from "express";
import Category from "../models/Category.js";
import ApiError from "../error/ApiError.js";
const router = express.Router();

// Yeni bir Kategori oluşturma (Create)
router.post("/", async (req, res) => {
    try {
        const { name, img } = req.body;

        // Validate input
        if (!name || !img) {
            throw new ApiError("Name and image URL are required.", 400); // Use ApiError for validation
        }

        // Create a new category
        const newCategory = new Category({ name, img });
        await newCategory.save(); // Save the new category to the database

        // Send a success response
        res.status(201).json({
            success: true,
            message: "Category created successfully.",
            data: newCategory
        });
    } catch (error) {
        console.error('Error creating category:', error); // Log the error
        if (error instanceof ApiError) {
            return res.status(error.statusCode).json({ success: false, message: error.message });
        }
        res.status(500).json({ success: false, error: "Server error." }); // Handle server errors
    }
});

// Kategori güncelleme (Update)
router.put("/:id", async (req, res) => {
  try {
      const { id } = req.params; // URL parametresinden kategori kimliğini al
      const { name, img } = req.body; // İstemciden gelen verileri al

      // Girdi doğrulama
      if (!name || !img) {
          throw new ApiError("Name and image URL are required.", 400); // ApiError kullanarak doğrulama
      }

      // Kategoriyi güncelle
      const updatedCategory = await Category.findByIdAndUpdate(
          id,
          { name, img },
          { new: true, runValidators: true } // Yeni güncellenmiş belgeyi döndür
      );

      // Eğer kategori bulunamazsa
      if (!updatedCategory) {
          throw new ApiError("Category not found.", 404);
      }

      // Başarı yanıtı gönder
      res.status(200).json({
          success: true,
          message: "Category updated successfully.",
          data: updatedCategory
      });
  } catch (error) {
      console.error('Error updating category:', error); // Hata kaydı
      if (error instanceof ApiError) {
          return res.status(error.statusCode).json({ success: false, message: error.message });
      }
      res.status(500).json({ success: false, error: "Server error." }); // Sunucu hatalarını yönet
  }
});

// Tüm Kategorileri getirme (Read - All)
router.get("/", async (req, res) => {
  try {
      const categories = await Category.find(); // Fetch all categories
      res.status(200).json({ success: true, data: categories }); // Wrap response in an object
  } catch (error) {
      console.error('Error fetching categories:', error); // Use console.error for logging errors
      res.status(500).json({ success: false, error: "Server error." }); // Consistent response structure
  }
});

// Belirli bir kategoriyi getirme (Read - Single)
router.get("/:categoryId", async (req, res) => {
  try {
    const categoryId = req.params.categoryId; // Get the category ID from the request parameters
    const category = await Category.findById(categoryId); // Find the category by ID

    if (!category) {
      throw new ApiError("Kategori bulunamadı", 404); // Throw an error if the category is not found
    }

    res.status(200).json(category); // Return the found category
  } catch (error) {
    console.log(error);
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    res.status(500).json({ error: "Server error." }); // Handle server errors
  }
});

// Kategori silme (Delete)
router.delete("/:categoryId", async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const deletedCategory = await Category.findByIdAndDelete(categoryId);

    if (!deletedCategory) {
      throw new ApiError("Kategori bulunamadı", 404); // Throw an error if the category is not found
    }

    res
      .status(200)
      .json({ message: "Kategori başarıyla silindi.", deletedCategory }); // Return a success message and the deleted category
  } catch (error) {
    console.log(error);
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    res.status(500).json({ error: "Server error." }); // Handle server errors
  }
});

export default router;
