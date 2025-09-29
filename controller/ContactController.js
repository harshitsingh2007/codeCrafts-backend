import mongoose from 'mongoose';

const ContactSchema = new mongoose.Schema({
    message:{
        type:String,
        required:true,
    },
    id:{
        type:String,
        required:true,
    }
},{timestamps:true});


const ContactModel = mongoose.model('Contact',ContactSchema);
export default ContactModel;


export const createcontact = async (req, res) => {
  const { message } = req.body;
  const { id } = req.params;

  try {
    const newcontact = await ContactModel.create({
      id: id,
      message: message,
    });
    
    if (!newcontact) {
      return res.status(400).json({
        success: false,
        message: "Contact not created"
      });
    }
    
    res.status(201).json({
      success: true,
      message: "Contact created successfully",
    });
  } catch (error) {
    console.log("createcontact error:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};
export const getAllContacts=async(req,res)=>{
    const {id}=req.params;
    try {
        const contacts=await ContactModel.find({
            id:id
        });
        res.status(200).json({
            success:true,
            message:"All contacts fetched successfully",
            data:contacts
        });
    } catch (error) {
        console.log("getAllContacts error:", error.message);
        res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
};


export const replycontact=async(req,res)=>{
    const {id}=req.params;
    try {
        const contact=await ContactModel.findById(id);
        if(!contact){
            return res.status(404).json({
                message:"contact not found"
            });
        }
        res.status(200).json({
            message:"Reply sent successfully"
        });
    } catch (error) {
        console.log("replycontact error:", error.message);
        res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
};


export const deletecontact=async(req,res)=>{
    const {id}=req.params;
    try {
        const res=await ContactModel.findByIdAndDelete(id);
        if(!res){
            return req.status(400).json({
                success:false,
                message:"contact not founded"
            })
        }
        res.status(200).json({
            success:true,
            message:"contact deleted successfully"
        })
        
    } catch (error) {
        console.log("deletecontact error:", error.message);
        res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}
