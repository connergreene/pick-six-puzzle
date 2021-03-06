app.factory('SpellingBeeFactory', function ($http) {
    return {

        create (newPuzz) {
            return $http({
                url: '/api/spelling-bee/',
                method: 'POST',
                data: newPuzz
            })
            .then(res => res.data);
        },

        fetchById (puzzId) {
            return $http({
                url: '/api/spelling-bee/' + puzzId,
                method: 'GET'
            })
            .then(res => res.data);
        },

        fetchByOwner (userId) {
            return $http({
                url: '/api/users/' + userId + '/spelling-bees',
                method: 'GET'
            })
            .then(res => res.data);
        },

        update (spellingBee) {
            return $http({
                url: '/api/spelling-bee/' + spellingBee._id,
                method: 'PUT',
                data: spellingBee
            })
            .then(res => res.data);
        },

        destroy (spellingBee) {
            return $http({
                url: '/api/spelling-bee/' + spellingBee._id,
                method: 'DELETE',
                data: spellingBee
            }).then(res => res.data);

        }
    }
});