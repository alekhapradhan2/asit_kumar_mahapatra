import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendSuccess, sendPaginated } from '../../utils/response';
import * as ClientService from './clients.service';

// GET /api/v1/clients
export const listClients = asyncHandler(async (req: Request, res: Response) => {
  const { clients, total } = await ClientService.listClients(req.query as any);
  sendPaginated(res, clients, total, Number(req.query.page || 1), Number(req.query.limit || 20), 'Clients retrieved');
});

// POST /api/v1/clients
export const createClient = asyncHandler(async (req: Request, res: Response) => {
  const client = await ClientService.createClient(req.body);
  sendSuccess(res, client, 'Client created successfully', 201);
});

// GET /api/v1/clients/:id
export const getClient = asyncHandler(async (req: Request, res: Response) => {
  const client = await ClientService.getClientById(req.params.id);
  sendSuccess(res, client, 'Client retrieved');
});

// PUT /api/v1/clients/:id
export const updateClient = asyncHandler(async (req: Request, res: Response) => {
  const client = await ClientService.updateClient(req.params.id, req.body);
  sendSuccess(res, client, 'Client updated');
});

// DELETE /api/v1/clients/:id  (soft disable)
export const disableClient = asyncHandler(async (req: Request, res: Response) => {
  await ClientService.disableClient(req.params.id);
  sendSuccess(res, null, 'Client account disabled');
});

// GET /api/v1/clients/:id/cases
export const getClientCases = asyncHandler(async (req: Request, res: Response) => {
  const cases = await ClientService.getClientCases(req.params.id);
  sendSuccess(res, cases, 'Client cases retrieved');
});
