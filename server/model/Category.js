const mongoose =  require ('mongoose');

const CreateCategory = new mongoose.Schema({
    Name :{
        type: String,
        required:true,
        unique:true,
    },
    slug:{
        type:String,
        lowercase:true
    }
})
 const CategoryModel = mongoose.model('category', CreateCategory)
module.exports = CategoryModel