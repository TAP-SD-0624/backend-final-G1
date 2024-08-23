import { Request, Response } from "express";
import { AddressService } from "../services";
import { inject, injectable } from "tsyringe";
import { AddressDTO, updateAddressDTO } from "../Types/DTO";
import { ValidationError } from "sequelize";

@injectable()
export class AddressController {
  constructor(@inject(AddressService) private addressService: AddressService) {
  }

  public async get(req: Request, res: Response) {
    const userId = (req as any).user.id;
    const id = req.params.id as unknown as number;
    try {
      const address = await this.addressService.getAddressByIdAndUserId(userId, id);
      if (!address) {
        return res.status(404).json({ error: 'Address not found' });
      }
      return res.status(200).json({ address });

    }
    catch (error) {
      return res.status(500).json({ error: 'internal server error, try again later.' });
    }
  }

  public async getAll(req: Request, res: Response) {
    const userId = (req as any).user.id;
    try {
      const addresses = await this.addressService.getAddressesByUserId(userId);
      if (addresses.length === 0) {
        return res.status(404).json({ error: 'Addresses not found' });
      }
      return res.status(200).json({ addresses });
    }
    catch (error) {
      return res.status(500).json({ error: 'internal server error, try again later.' });
    }
  }

  public async create(req: Request, res: Response) {
    const userId = (req as any).user.id;
    const addressData = req.body as AddressDTO;
    try {
      const address = await this.addressService.createAddress(userId, addressData);
      return res.status(201).json({ address });
    }
    catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: 'internal server error, try again later.' });
    }
  }

  public async update(req: Request, res: Response) {
    const userId = (req as any).user.id;
    const id = req.params.id as unknown as number;
    const addressData = req.body as updateAddressDTO;
    try {
      const address = await this.addressService.updateAddress(id, userId, addressData);
      if (!address) {
        return res.status(404).json({ error: 'Address not found' });
      }
      return res.status(200).json({ address });
    }
    catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: 'internal server error, try again later.' });
    }

  }

  public async delete(req: Request, res: Response) {
    const userId = (req as any).user.id;
    const id = req.params.id as unknown as number;
    try {
      const address = await this.addressService.deleteAddress(id, userId);
      if (!address) {
        return res.status(404).json({ error: 'Address not found' });
      }
      return res.status(200).json({ address });
    }
    catch (error) {
      return res.status(500).json({ error: 'internal server error, try again later.' });
    }
  }
}