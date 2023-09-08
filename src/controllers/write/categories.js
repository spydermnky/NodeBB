"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const privileges_1 = __importDefault(require("../../privileges"));
const categories_1 = __importDefault(require("../../categories"));
const api_1 = __importDefault(require("../../api"));
const helpers_1 = __importDefault(require("../helpers"));
const Categories = {};
const hasAdminPrivilege = (uid) => __awaiter(void 0, void 0, void 0, function* () {
    // The next line calls a function in a module that has not been updated to TS yet
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    const ok = yield privileges_1.default.admin.can(`admin:categories`, uid);
    if (!ok) {
        throw new Error('[[error:no-privileges]]');
    }
});
Categories.get = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    helpers_1.default.formatApiResponse(200, res, yield api_1.default.categories.get(req, req.params));
});
Categories.create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield hasAdminPrivilege(req.uid);
    const response = yield api_1.default.categories.create(req, req.body);
    helpers_1.default.formatApiResponse(200, res, response);
});
Categories.update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield hasAdminPrivilege(req.uid);
    const payload = {};
    payload[req.params.cid] = req.body;
    yield api_1.default.categories.update(req, payload);
    const categoryObjs = yield categories_1.default.getCategories([req.params.cid]);
    helpers_1.default.formatApiResponse(200, res, categoryObjs[0]);
});
Categories.delete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield hasAdminPrivilege(req.uid);
    yield api_1.default.categories.delete(req, { cid: req.params.cid });
    helpers_1.default.formatApiResponse(200, res);
});
Categories.getPrivileges = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(yield privileges_1.default.admin.can('admin:privileges', req.uid))) {
        throw new Error('[[error:no-privileges]]');
    }
    const privilegeSet = yield api_1.default.categories.getPrivileges(req, req.params.cid);
    helpers_1.default.formatApiResponse(200, res, privilegeSet);
});
Categories.setPrivilege = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(yield privileges_1.default.admin.can('admin:privileges', req.uid))) {
        throw new Error('[[error:no-privileges]]');
    }
    yield api_1.default.categories.setPrivilege(req, Object.assign(Object.assign({}, req.params), { member: req.body.member, set: req.method === 'PUT' }));
    const privilegeSet = yield api_1.default.categories.getPrivileges(req, req.params.cid);
    helpers_1.default.formatApiResponse(200, res, privilegeSet);
});
Categories.setModerator = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(yield privileges_1.default.admin.can('admin:admins-mods', req.uid))) {
        throw new Error('[[error:no-privileges]]');
    }
    const privilegeList = yield privileges_1.default.categories.getUserPrivilegeList();
    yield api_1.default.categories.setPrivilege(req, {
        cid: req.params.cid,
        privilege: privilegeList,
        member: req.params.uid,
        set: req.method === 'PUT',
    });
    helpers_1.default.formatApiResponse(200, res);
});
