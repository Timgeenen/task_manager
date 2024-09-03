const createConnectionObj = (userObj) => {
  const { _id, name, role, email} = userObj;
  return {
    id: _id,
    name: name,
    role: role,
    email: email
  }
}

module.exports = {
  createConnectionObj
}