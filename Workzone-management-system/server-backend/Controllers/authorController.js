// // // AuthorController.js

// // var db = require('../modals/index.js');
// // const Book = db.bookmodel;

// // const Category = db.categoryModel;
// // const FAQ = db.faqModel;
// // const Author = db.authorModel;
// // const { Op, Sequelize } = require('sequelize');
// // const {uploadOnCloudinary,deleteOnCloudinary} = require("../utils/cloudinary.js");

// // const AuthorController = {

// //     async createAuthor(req, res) {
// //         try {
// //             const { authorName, bio, profilePicture, socialLinks, email, phoneNumber, awards, dateOfBirth } = req.body;
// //             const newAuthor = await Author.create({
// //                 authorName,
// //                 bio,
// //                 profilePicture,
// //                 socialLinks,
// //                 email,
// //                 phoneNumber,
// //                 awards,
// //                 dateOfBirth,
// //             });
// //             return res.status(201).json(newAuthor);
// //         } catch (error) {
// //             console.error(error);
// //             return res.status(500).json({ error: 'Failed to create author' });
// //         }
// //     },

  
// //     async getAllAuthors(req, res) {
// //         try {
// //             const authors = await Author.findAll({
// //                 include: [{ model: Book, as: 'books' }],
// //             });
// //             return res.status(200).json(authors);
// //         } catch (error) {
// //             console.error(error);
// //             return res.status(500).json({ error: 'Failed to retrieve authors' });
// //         }
// //     },

   
// //     async getAuthorById(req, res) {
// //         try {
// //             const { id } = req.query;
// //             const author = await Author.findByPk(id, {
// //                 include: [{ model: Book, as: 'books' }],
// //             });
// //             if (!author) {
// //                 return res.status(404).json({ error: 'Author not found' });
// //             }
// //             return res.status(200).json(author);
// //         } catch (error) {
// //             console.error(error);
// //             return res.status(500).json({ error: 'Failed to retrieve author' });
// //         }
// //     },

   
// //     async updateAuthor(req, res) {
// //         try {
// //             const  id  = req.query.id;
// //             console.log(req.query.id)
// //             const { authorName, bio, profilePicture, socialLinks, email, phoneNumber, awards, dateOfBirth } = req.body;
// //             const author = await Author.findByPk(id);
// //             if (!author) {
// //                 return res.status(404).json({ error: 'Author not found' });
// //             }
// //             await author.update({
// //                 authorName,
// //                 bio,
// //                 profilePicture,
// //                 socialLinks,
// //                 email,
// //                 phoneNumber,
// //                 awards,
// //                 dateOfBirth,
// //             });
// //             return res.status(200).json(author);
// //         } catch (error) {
// //             console.error(error);
// //             return res.status(500).json({ error: 'Failed to update author' });
// //         }
// //     },

   
// //     async deleteAuthor(req, res) {
// //         try {
// //             const { id } = req.params;
// //             const author = await Author.findByPk(id);
// //             if (!author) {
// //                 return res.status(404).json({ error: 'Author not found' });
// //             }
// //             await author.destroy();
// //             return res.status(200).json({ message: 'Author deleted successfully' });
// //         } catch (error) {
// //             console.error(error);
// //             return res.status(500).json({ error: 'Failed to delete author' });
// //         }
// //     },

  
// //     async addBookToAuthor(req, res) {
// //         try {
// //             const { authorId, bookId } = req.body;
// //             const author = await Author.findByPk(authorId);
// //             if (!author) {
// //                 return res.status(404).json({ error: 'Author not found' });
// //             }
// //             const book = await Book.findByPk(bookId);
// //             if (!book) {
// //                 return res.status(404).json({ error: 'Book not found' });
// //             }
// //             await author.addBook(book); // Assuming the association method exists
// //             return res.status(200).json({ message: 'Book added to author successfully' });
// //         } catch (error) {
// //             console.error(error);
// //             return res.status(500).json({ error: 'Failed to add book to author' });
// //         }
// //     },
// // };

// // module.exports = AuthorController;
// var db = require('../modals/index.js');
// const Book = db.bookmodel;
// const Author = db.authorModel;
// const { Op, Sequelize } = require('sequelize');
// const { uploadOnCloudinary, deleteOnCloudinary } = require("../utils/cloudinary.js");
// const AuthorController = {
//     // Create a new author
//     async createAuthor(req, res) {
//         try {
//             const {
//                 authorName, bio, profilePicture, socialLinks, email, phoneNumber, awards, dateOfBirth
//             } = req.body;

            
//             const newAuthor = await Author.create({
//                 authorName,  
//                 bio,  
//                 profilePicture,
//                 socialLinks, 
//                 email,
//                 phoneNumber,
//                 awards,  
//                 dateOfBirth,
//             });

//             return res.status(201).json(newAuthor.dataValues);
//         } catch (error) {
//             console.error(error);
//             return res.status(500).json({ error: 'Failed to create author' });
//         }
//     },

//     // Get all authors
//     async getAllAuthors(req, res) {
//         try {
//             const authors = await Author.findAll({
//                 include: [{ model: Book, as: 'books' }],
//                 raw:true,
//             });
//             return res.status(200).json(authors);
//         } catch (error) {
//             console.error(error);
//             return res.status(500).json({ error: 'Failed to retrieve authors' });
//         }
//     },

//     // Get author by ID
//     async getAuthorById(req, res) {
//         try {
//             const { id } = req.query;
//             const author = await Author.findByPk(id, {
//                 include: [{ model: Book, as: 'books' }],
//                 raw:true,
//             });

//             if (!author) {
//                 return res.status(404).json({ error: 'Author not found' });
//             }

//             return res.status(200).json(author);
//         } catch (error) {
//             console.error(error);
//             return res.status(500).json({ error: 'Failed to retrieve author' });
//         }
//     },

//     // Update author details
//     async updateAuthor(req, res) {
//         try {
//             const { id } = req.query;
//             const { authorName, bio, profilePicture, socialLinks, email, phoneNumber, awards, dateOfBirth } = req.body;

//             const author = await Author.findByPk(id);
//             if (!author) {
//                 return res.status(404).json({ error: 'Author not found' });
//             }

//             await author.update({
//                 authorName,  // JSON structure expected
//                 bio,  // JSON structure expected
//                 profilePicture,
//                 socialLinks, // Will be serialized as JSON
//                 email,
//                 phoneNumber,
//                 awards,  // Will be serialized as JSON
//                 dateOfBirth,
//             });

//             return res.status(200).json(author);
//         } catch (error) {
//             console.error(error);
//             return res.status(500).json({ error: 'Failed to update author' });
//         }
//     },

//     // Delete author
//     async deleteAuthor(req, res) {
//         try {
//             const { id } = req.params;
//             const author = await Author.findByPk(id);
//             if (!author) {
//                 return res.status(404).json({ error: 'Author not found' });
//             }
//             await author.destroy();
//             return res.status(200).json({ message: 'Author deleted successfully' });
//         } catch (error) {
//             console.error(error);
//             return res.status(500).json({ error: 'Failed to delete author' });
//         }
//     },

//     // Add a book to an author
//     async addBookToAuthor(req, res) {
//         try {
//             const { authorId, bookId } = req.body;

//             const author = await Author.findByPk(authorId);
//             if (!author) {
//                 return res.status(404).json({ error: 'Author not found' });
//             }

//             const book = await Book.findByPk(bookId);
//             if (!book) {
//                 return res.status(404).json({ error: 'Book not found' });
//             }

//             // Assuming the association method exists, this adds a book to an author
//             await author.addBook(book);

//             return res.status(200).json({ message: 'Book added to author successfully' });
//         } catch (error) {
//             console.error(error);
//             return res.status(500).json({ error: 'Failed to add book to author' });
//         }
//     },
// };

// module.exports = AuthorController;

const { translateText } = require('../utils/translator'); 
var db = require('../modals/index.js');
const Book = db.bookmodel;
const  User =db.userModel;
const Category = db.categoryModel;
const Author = db.authorModel;
const AuthorController = {
    // Create a new author
    async createAuthor(req, res) {
        try {
            const {
                authorName, bio, profilePicture, socialLinks, email, phoneNumber, awards, dateOfBirth
            } = req.body;

            // Translate `authorName` and `bio` if provided
            const supportedLanguages = ['en', 'ur', ];

            const translateField = async (field) => {
                if (typeof field === 'object' && field !== null) {
                    for (const lang of supportedLanguages) {
                        if (!field[lang]) {
                            const sourceLang = Object.keys(field)[0]; // Use the first available language as the source
                            field[lang] = await translateText(field[sourceLang], lang);
                        }
                    }
                }
                return field;
            };

            const translatedAuthorName = await translateField(authorName || {});
            const translatedBio = await translateField(bio || {});
            // Create new author
            const newAuthor = await Author.create({
                authorName: translatedAuthorName,
                bio: translatedBio,
                profilePicture,
                socialLinks,
                email,
                phoneNumber,
                awards,
                dateOfBirth,
            });

            return res.status(201).json(newAuthor.dataValues);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Failed to create author' });
        }
    },

    // Get all authors
    async getAllAuthors(req, res) {
        try {
            const authors = await Author.findAll({
                include: [{ model: Book, as: 'books' }],
                raw: true
            });
            return res.status(200).json(authors);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Failed to retrieve authors' });
        }
    },

    // Get author by ID
    async getAuthorById(req, res) {
        try {
            const { id } = req.query;
            const author = await Author.findByPk(id, {
                include: [{ model: Book, as: 'books' }],
                raw:true
            });

            if (!author) {
                return res.status(404).json({ error: 'Author not found' });
            }

            return res.status(200).json(author);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Failed to retrieve author' });
        }
    },

    // Update author details
    async updateAuthor(req, res) {
        try {
            const { id } = req.query; // Extract the author's ID from the query
            const { authorName, bio, profilePicture, socialLinks, email, phoneNumber, awards, dateOfBirth } = req.body;

            // Find the author by ID
            const author = await Author.findByPk(id);
            if (!author) {
                return res.status(404).json({ error: 'Author not found' });
            }

            // Helper function to process translations
            const translateField = async (field, existingField) => {
                if (typeof field === 'object' && field !== null) {
                    const supportedLanguages = ['en', 'ur', 'roman'];
                    for (const lang of supportedLanguages) {
                        if (!field[lang] && existingField?.[lang]) {
                            field[lang] = existingField[lang]; // Keep existing translation if present
                        } else if (!field[lang]) {
                            const sourceLang = Object.keys(field)[0]; // Use the first available language as the source
                            field[lang] = await translateText(field[sourceLang], lang);
                        }
                    }
                }
                return field;
            };

            // Translate authorName if provided
            const updatedAuthorName = authorName
                ? await translateField(authorName, author.authorName)
                : author.authorName;

            // Translate bio if provided
            const updatedBio = bio ? await translateField(bio, author.bio) : author.bio;

            // Update other fields directly if provided, otherwise retain existing values
            await author.update({
                authorName: updatedAuthorName,
                bio: updatedBio,
                profilePicture: profilePicture || author.profilePicture,
                socialLinks: socialLinks || author.socialLinks,
                email: email || author.email,
                phoneNumber: phoneNumber || author.phoneNumber,
                awards: awards || author.awards,
                dateOfBirth: dateOfBirth || author.dateOfBirth,
            });

            return res.status(200).json(author);
        } catch (error) {
            console.error('Error updating author:', error);
            return res.status(500).json({ error: 'Failed to update author' });
        }
    },

    // Delete author
    async deleteAuthor(req, res) {
        try {
            const { id } = req.params;
            const author = await Author.findByPk(id);
            if (!author) {
                return res.status(404).json({ error: 'Author not found' });
            }
            await author.destroy();
            return res.status(200).json({ message: 'Author deleted successfully' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Failed to delete author' });
        }
    },

    // Add a book to an author
    async addBookToAuthor(req, res) {
        try {
            const { authorId, bookId } = req.body;

            const author = await Author.findByPk(authorId);
            if (!author) {
                return res.status(404).json({ error: 'Author not found' });
            }

            const book = await Book.findByPk(bookId);
            if (!book) {
                return res.status(404).json({ error: 'Book not found' });
            }

            // Assuming the association method exists, this adds a book to an author
            await author.addBook(book);

            return res.status(200).json({ message: 'Book added to author successfully' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Failed to add book to author' });
        }
    },
};

module.exports = AuthorController;
