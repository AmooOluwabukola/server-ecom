const mongoose =require ('mongoose');

const productSchema= mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true,
        unique:true,

      },
      category:{
        type: String, 
        required: true 
      },
    price:{
        type: Number,
        required: true,
        

      },
      description:{
        type:String,
        required:true,
      },
      image:{
        type:String,
        required:true
      },
      createdAt: { type: Date, default: Date.now },


}
)

const PRODUCT = mongoose.model('Product', productSchema)

module.exports= PRODUCT