app.factory('PickSixFactory', function ($http) {
    return {

        create (newPuzz) {
            return $http({
                url: '/api/pick-six/',
                method: 'POST',
                data: newPuzz
            })
            .then(res => res.data);
        },

        fetchById (puzzId) {
            return $http({
                url: '/api/pick-six/' + puzzId,
                method: 'GET'
            })
            .then(res => res.data);
        },

        fetchByOwner (userId) {
            return $http({
                url: '/api/users/' + userId + '/pick-sixes',
                method: 'GET'
            })
            .then(res => res.data);
        },

        update (pickSix) {
            return $http({
                url: '/api/pick-six/' + pickSix._id,
                method: 'PUT',
                data: pickSix
            })
            .then(res => res.data);
        },

        delete (pickSix) {
            return $http({
                url: '/api/pick-six/' + pickSix._id,
                method: 'DELETE',
                data: pickSix
            }).then(res => res.data);

        }
    }
});