class User  {
/**
    * @param {Object} data - Данные пользователя
    * @param {string} data.id - Уникальный идентификатор
    * @param {string} data.name - имя пользователя
    * @param {string} data.role - роль пользователя

*/
    constructor(data) {
        this._id = data.id;
        this._name = data.name;
        this._role = data.role;
    }


    get id() {return this._id}
    get name() {return this._name}
    get role() {return this._role}
}