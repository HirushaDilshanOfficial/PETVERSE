import Service from "../Models/Service.js";

export async function getAllServices(req,res){
    try{
        const services=await Service.find().sort({createdAt:-1});
        res.status(200).json(services);

    }catch(error){
        console.error("Error in getAllServices controller",error);
        res.status(500).json({message:"Internal server error"});
    }
}
export async function getServiceById(req,res){
    try{
        const service=await Service.findById(req.params.id);
        if(!service) return res.status(404).json({message:"Service not found"});
        res.json(service);

    }catch(error){
        console.error("Error in getAllServices controller",error);
        res.status(500).json({message:"Internal server error"});
    }
}


export async function createService(req,res){
    try{
        const{userID,title,description,price,images}=req.body
        const service=new Service({userID,title,description,price,images})

        const savedService=await service.save()
        res.status(201).json(savedService);
    }catch(error){
        console.error("Error in createServices controller",error);
        res.status(500).json({message:"Internal server error"});
    }
}

export async function updateService(req,res){
    try{
        const {userID,title,description,price,images}=req.body;
        const updatedService=await Service.findByIdAndUpdate(req.params.id,{userID,title,description,price,images},{
           new:true, 
        });

        if(!updatedService) return res.status(404).json({message:"Service not found"});
        res.status(200).json(updatedService);
    }catch(error){
        res.status(500).json({message:"Internal server error"});
    }
}

export async function deleteService(req,res){
    try{
        const deletedService=await Service.findByIdAndDelete(req.params.id)
        if(!deleteService) return res.status(404).json({message:"Service not found"});
        res.status(200).json({message:"Service deleted successfully!"})
    }catch(error){
        console.error("Error in deletedService controller", error);
        res.status(500).json({message:"Internal server error"});
    }
}