'use strict';

import privileges from '../../privileges';
import categories from '../../categories';
import api from '../../api';

import helpers from '../helpers';

const Categories : any = module.exports;

const hasAdminPrivilege = async (uid: string) => {
    const ok = await privileges.admin.can(`admin:categories`, uid);
    if (!ok) {
        throw new Error('[[error:no-privileges]]');
    }
};

Categories.get = async (req: any, res: any) => {
    helpers.formatApiResponse(200, res, await api.categories.get(req, req.params));
};

Categories.create = async (req: any, res: any) => {
    await hasAdminPrivilege(req.uid);

    const response = await api.categories.create(req, req.body);
    helpers.formatApiResponse(200, res, response);
};

Categories.update = async (req: any, res: any) => {
    await hasAdminPrivilege(req.uid);

    const payload: any = {};
    payload[req.params.cid] = req.body;
    await api.categories.update(req, payload);
    const categoryObjs = await categories.getCategories([req.params.cid]);
    helpers.formatApiResponse(200, res, categoryObjs[0]);
};

Categories.delete = async (req: any, res: any) => {
    await hasAdminPrivilege(req.uid);

    await api.categories.delete(req, { cid: req.params.cid });
    helpers.formatApiResponse(200, res);
};

Categories.getPrivileges = async (req: any, res: any) => {
    if (!await privileges.admin.can('admin:privileges', req.uid)) {
        throw new Error('[[error:no-privileges]]');
    }
    const privilegeSet = await api.categories.getPrivileges(req, req.params.cid);
    helpers.formatApiResponse(200, res, privilegeSet);
};

Categories.setPrivilege = async (req: any, res: any) => {
    if (!await privileges.admin.can('admin:privileges', req.uid)) {
        throw new Error('[[error:no-privileges]]');
    }

    await api.categories.setPrivilege(req, {
        ...req.params,
        member: req.body.member,
        set: req.method === 'PUT',
    });

    const privilegeSet = await api.categories.getPrivileges(req, req.params.cid);
    helpers.formatApiResponse(200, res, privilegeSet);
};

Categories.setModerator = async (req: any, res: any) => {
    if (!await privileges.admin.can('admin:admins-mods', req.uid)) {
        throw new Error('[[error:no-privileges]]');
    }
    const privilegeList = await privileges.categories.getUserPrivilegeList();
    await api.categories.setPrivilege(req, {
        cid: req.params.cid,
        privilege: privilegeList,
        member: req.params.uid,
        set: req.method === 'PUT',
    });
    helpers.formatApiResponse(200, res);
};




