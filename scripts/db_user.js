db.createUser({ user: 'jsmith', pwd: 'some-initial-password', roles: [ { role: "userAdminAnyDatabase", db: "admin" } ] });
