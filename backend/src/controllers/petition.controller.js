"use strict";

import Petition from "../entity/petition.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { 
    updateValidation, 
    createValidation, 
    updateRevised 
} from "../validations/petition.validation.js";

export async function getAllPetitions(req, res){
    try{
        const petitionRepository = AppDataSource.getRepository(Petition);
        const petitions = await petitionRepository.find();

        res.status(200).json({message: "Petición encontrada: ", data: petitions});

    }catch(error){
        console.error("Error al conseguir la petición: ",error);
        res.status(500).json({message: "Error al conseguir la petición."})
    }
}

export async function getUserPetitions(req, res){
    try{
        const userRut = req.user.rut;
        const petitionRepository = AppDataSource.getRepository(Petition);
        const userPetitions = await petitionRepository.find({ where: { userRut } });

        if (userPetitions.length === 0)
            return res.status(404).json({ message: "No se encontraron peticiones para este vecino." });

        res.status(200).json({message: "Peticiones encontrada: ", data: userPetitions});

    }catch(error){
        console.error("Error al conseguir la petición: ",error);
        res.status(500).json({message: "Error al conseguir la petición."})
    }
}

export async function getPetitionId(req, res){
    try{
        const petitionRepository = AppDataSource.getRepository(Petition);
        const {id} = req.params;
        const petition = await petitionRepository.findOne({ where:{id} });

        if(!petition) 
            return res.status(404).json({message: "Peticiónes no encontradas."});

        res.status(200).json({message: "Peticiones encontradas: ", data: petition});

    }catch(error){
        console.error("Error al conseguir la petición: ", error);
        res.status(500).json({message: "Error al conseguir la petición."})
    }
}

export async function createPetition(req, res){
    try{
        const userRut = req.user.rut;
        const petitionRepository = AppDataSource.getRepository(Petition);
        const {title, description} = req.body;

        const {error} = createValidation.validate(req.body);

        if(error) 
            return res.status(400).json({message: "Error al crear la petición: ", error: error});

        const newPetition = petitionRepository.create({
            userRut, title, description,
        });

        await petitionRepository.save(newPetition);

        res.status(200).json({message: "Petición creada exitosamente.", data: newPetition});

    }catch(error){
        console.error("Error al crear la petición: ", error);
        res.status(500).json({message: "Error al crear la petición."});
    }
}

export async function updatePetition(req, res){
    try{
        const petitionRepository = AppDataSource.getRepository(Petition);
        const {id} = req.params;
        const {title, description} = req.body;
        const petition = await petitionRepository.findOne({ where: {id} });

        if(!petition) 
            return res.status(404).json({message: "Petición no encontrada."});

        const {error} = updateValidation.validate(req.body);
        
        if(error) 
            return res.status(400).json({message: "Error al actualizar la petición: ", error});

        if(req.user.rut !== petition.userRut)
            return res.status(401).json({message: "Petición no corresponde al usuario."});

        if(petition.revised) 
            return res.status(401).json({message: "Petición ya fue revisada."});

        petition.title = title || petition.title;
        petition.description = description || petition.description;

        await petitionRepository.save(petition);

        res.status(200).json({message: "Petición actualizada exitosamente: ", data:petition});

    }catch(error){
        console.error("Error al actualizar la petición: ",error);
        res.status(500).json({message: "Error al actualizar la petición."})
    }
}

export async function setRevised(req, res){
    try{
        const petitionRepository = AppDataSource.getRepository(Petition);
        const { id } = req.params;
        const { revised } = req.body;
        const petition = await petitionRepository.findOne({ where: {id} });

        if(!petition) 
            return res.status(404).json({message: "Petición no encontrada."});

        const { error } = updateRevised.validate(req.body);

        if(error) 
            return res.status(400).json({message: "Error al actualizar la petición: ", error});

        if(petition.revised === true && revised === false)
            return res.status(400).json({message: "No se puede cambiar una petición ya revisada a no revisada."});

        if(petition.revised === false && revised === false)
            return res.status(400).json({message: "No se puede cambiar una petición no revisada a no revisada."});


        petition.revised = revised;

        await petitionRepository.save(petition);

        res.status(200).json({message: "Petición actualizada exitosamente: ", data:petition});

    }catch{
        console.error("Error al actualizar la petición: ", error);
        res.status(500).json({message: "Error al actualizar la petición."});
    }
}

export async function deletePetition(req, res){
    try{
        const petitionRepository = AppDataSource.getRepository(Petition);
        const {id} = req.params;
        const petition = await petitionRepository.findOne({ where:{id} });

        if(!petition) 
            return res.status(404).json({message: "Petición no encontrada."});

        if(req.user.rut !== petition.userRut)
            return res.status(401).json({message: "Petición no corresponde al usuario."});

        if(petition.revised)
            return res.status(401).json({message: "Petición esta revisada, no se puede eliminar"});

        await petitionRepository.remove(petition);

        res.status(200).json({message: "Petición eliminada exitosamente."});

    }catch(error){
        console.error("Error al eliminar la petición: ", error);
        res.status(500).json({message: "Error al eliminar la petición."})
    }
}