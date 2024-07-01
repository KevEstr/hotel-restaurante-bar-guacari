const asyncHandler = require("express-async-handler");
const Agreement = require("../models").Agreement;
const AgreementService = require("../models").AgreementService;

const { Op } = require("sequelize");
const { Service, sequelize } = require("../models");


//@desc     Create a ingredient
//@route    POST /api/ingredients
//@access   Private/ingredient

exports.createAgreement = asyncHandler(async (req, res) => {
    const { name, serviceIds, userId } = req.body;
    console.log("NOMBRE: ", name);
    console.log("USUARIO: ", userId);
    console.log("SERVICIOS IDS: ", serviceIds);

    if (!name || !userId || !Array.isArray(serviceIds)) {
        res.status(400).json({ message: "Faltan campos requeridos" });
        return;
    }

    // Usar transacción para garantizar la atomicidad de las operaciones
    const transaction = await sequelize.transaction();
    try {
        // Crear el acuerdo
        const createdAgreement = await Agreement.create({ name, userId }, { transaction });
        console.log("CONVENIO CREADO: ", createdAgreement);

        // Agregar los servicios al acuerdo si existen
        if (serviceIds.length) {
            const services = await Service.findAll({
                where: {
                    id: serviceIds
                }
            });
            console.log("SERVICIOS PARA CONVENIO CREADO: ", services);

            // Añadir servicios al acuerdo
            await createdAgreement.addService(services, { transaction });
            console.log("CONVENIO CON SERVICIOS: ", createdAgreement);
        }

        await transaction.commit();
        res.status(201).json(createdAgreement);
    } catch (error) {
        // Revertir la transacción en caso de error
        await transaction.rollback();
        res.status(500).json({ message: "Error al crear el acuerdo", error: error.message });
    }
});

//@desc     Get all ingredients
//@route    GET /api/ingredients
//@access   Private/user
exports.getAgreements = asyncHandler(async (req, res) => {
    const pageSize = 5;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword ? req.query.keyword : null;
    let options = {};

    if (keyword) {
        options = {
            ...options,
            where: {
                [Op.or]: [
                    { id: { [Op.like]: `%${keyword}%` } },
                    { name: { [Op.like]: `%${keyword}%` } },
                ],
            },
        };
    }

    const count = await Agreement.count({ ...options });
    const agreements = await Agreement.findAll({ ...options, include: [
        {
          model: Service,
          as: 'service', // Use the alias defined in the belongsToMany association
          through: AgreementService, // Specify the through model
        },
      ], });

    res.json({ agreements, page, pages: Math.ceil(count / pageSize) });
});

//@desc     Get ingredient by ID
//@route    GET /api/ingredients/:id
//@access   Private/user

exports.getAgreement = asyncHandler(async (req, res) => {
    const agreementId = req.params.id;

    try {
        // Buscar el acuerdo por su id
        const agreement = await Agreement.findByPk(agreementId);

        if (!agreement) {
            res.status(404).json({ message: "Agreement not found" });
            return;
        }

        // Obtener los servicios asociados al acuerdo
        const services = await agreement.getService();

        res.json({ agreement, services });
    } catch (error) {
        res.status(500).json({ message: "Error al buscar el acuerdo", error: error.message });
    }
});

//@desc     Update a ingredient
//@route    PUT /api/ingredients/:id
//@access   Private/user
exports.updateAgreement = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, serviceIds } = req.body;
    const userId = req.user.id; // Asumiendo que el userId no cambia

    console.log("ID DEL CONVENIO: ", id);
    console.log("NOMBRE: ", name);
    console.log("USUARIO: ", userId);
    console.log("SERVICIOS IDS: ", serviceIds);

    if (!id || !name || !userId || !Array.isArray(serviceIds)) {
        res.status(400).json({ message: "Faltan campos requeridos" });
        return;
    }

    // Usar transacción para garantizar la atomicidad de las operaciones
    const transaction = await sequelize.transaction();
    try {
        // Buscar el acuerdo existente
        const agreement = await Agreement.findByPk(id, { transaction });

        if (!agreement) {
            await transaction.rollback();
            res.status(404).json({ message: "Acuerdo no encontrado" });
            return;
        }

        // Actualizar el acuerdo
        agreement.name = name;
        agreement.userId = userId; // Asumiendo que el userId no cambia
        await agreement.save({ transaction });

        // Actualizar los servicios asociados
        if (serviceIds.length) {
            const services = await Service.findAll({
                where: {
                    id: serviceIds
                },
                transaction
            });

            console.log("SERVICIOS PARA CONVENIO ACTUALIZADO: ", services);

            // Actualizar servicios al acuerdo
            await agreement.setService(services, { transaction });
            console.log("CONVENIO CON SERVICIOS ACTUALIZADOS: ", agreement);
        }

        await transaction.commit();
        res.status(200).json(agreement);
    } catch (error) {
        // Revertir la transacción en caso de error
        await transaction.rollback();
        res.status(500).json({ message: "Error al actualizar el acuerdo", error: error.message });
    }
});

//@desc     Delete a ingredient
//@route    DELETE /api/ingredients/:id
//@access   Private/user
exports.deleteAgreement = asyncHandler(async (req, res) => {
    const agreement = await Agreement.findByPk(req.params.id);

    if (agreement) {
        await agreement.destroy();
        res.json({ message: "Agreement removed" });
    } else {
        res.status(404);
        throw new Error("Agreement not found");
    }
});