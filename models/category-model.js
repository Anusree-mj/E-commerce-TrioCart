
const mongoosedb = require('./mongodb');
// category collection
const CategorySchema = new mongoosedb.Schema(
    {
        category: {
            type: String,
        },
        subCategory: [
            {
                name: {
                    type: String,
                    required: true,
                }, isDeleted: {
                    type: Boolean,
                    default: false,
                },
                discount: {
                    type: Number,
                    default: 0,
                }
            },
        ],
    },
    {
        timestamps: true, // This option adds createdAt and updatedAt timestamps
    }
);
const categoryCollection = new mongoosedb.model("categories", CategorySchema);

module.exports = categoryCollection