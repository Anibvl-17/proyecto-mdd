"use strict";

import Petition from "../entity/petition.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { updateValidation, createValidation, updateRevised } from "../validations/petition.validation.js";

export async function getPetition(req, res){
    try{
        const petitionRepository = AppDataSource.getRepository(Petition);
        const petitions = await petitionRepository.find();

        res.status(200).json({message: 'Peticion encontrada: ', data: petitions});

    }catch(error){
        console.error("Error al conseguir la peticion: ",error);
        res.status(500).json({message: "Error al conseguir la peticion."})
    }
}

export async function getPetitionId(req, res){
    try{
        const petitionRepository = AppDataSource.getRepository(Petition);
        const {id} = req.params;
        const petition = await petitionRepository.findOne({ where:{id} });

        if(!petition) 
            return res.status(404).json({message: "Peticion no encontrada"});

        res.status(200).json({message: "Peticion encontrada: ", data: petition});

    }catch(error){
        console.error("Error al conseguir la peticion: ", error);
        res.status(500).json({message: "Error al conseguir la peticion."})
    }
}

export async function createPetition(req, res){
    try{
        const petitionRepository = AppDataSource.getRepository(Petition);
        const {title, description} = req.body;
        const {error} = createValidation.validate(req.body);

        if(error) 
            return res.status(400).json({message: "Error al crear la peticion: ", error: error});

        const newPetition = petitionRepository.create({
            title, description,
        });

        await petitionRepository.save(newPetition);

        res.status(200).json({message: "Peticion creada exitosamente", data: newPetition});

    }catch(error){
        console.error("Error al crear la peticion: ", error);
        res.status(500).json({message: "Error al crear la peticion."});
    }
}

export async function updatePetition(req, res){
    try{
        const petitionRepository = AppDataSource.getRepository(Petition);
        const {id} = req.params;
        const {title, description} = req.body;
        const petition = await petitionRepository.findOne({ where: {id} });

        if(!petition) 
            return res.status(404).json({message: "Peticion no encontrada"});

        const {error} = updateValidation.validate(req.body);
        
        if(error) 
            return res.status(400).json({message: "Error al actualizar la peticion: ", error});

        petition.title = title || petition.title;
        petition.description = description || petition.description;

        await petitionRepository.save(petition);

        res.status(200).json({message: "Peticion actualizada exitosamente: ", data:petition});

    }catch(error){
        console.error("Error al actualizar la peticion: ",error);
        res.status(500).json({message: "Error al actualizar la peticion."})
    }
}

export async function setRevised(req, res){
    try{
        const petitionRepository = AppDataSource.getRepository(Petition);
        const { id } = req.params;
        const { revised } = req.body;
        const petition = await petitionRepository.findOne({ where: {id} });

        if(!petition) 
            return res.status(404).json({message: "Peticion no encontrada"});

        const { error } = updateRevised.validate(req.body);

        if(error) 
            return res.status(400).json({message: "Error al actualizar la peticion: ", error});

        if(petition.revised === true && revised === false)
            return res.status(400).json({message: "No se puede cambiar una peticion ya revisada a no revisada"});

        if(petition.revised === false && revised === false)
            return res.status(400).json({message: "No se puede cambiar una peticion no revisada a no revisada"});


        petition.revised = revised;

        await petitionRepository.save(petition);

        res.status(200).json({message: "Peticion actualizada exitosamente: ", data:petition});

    }catch{
        console.error("Error al actualizar la peticion: ", error);
        res.status(500).json({message: "Error al actualizar la peticion."});
    }
}

export async function deletePetition(req, res){
    try{
        const petitionRepository = AppDataSource.getRepository(Petition);
        const {id} = req.params;
        const petition = await petitionRepository.findOne({ where:{id} });

        if(!petition) 
            return res.status(404).json({message: "Peticion no encontrada"});

        await petitionRepository.remove(petition);

        res.status(200).json({message: "Peticion eliminada exitosamente"});

    }catch(error){
        console.error("Error al eliminar la peticion: ", error);
        res.status(500).json({message: "Error al eliminar la peticion."})
    }
}