'use strict'
app.directive('spellingbee', function(){
    return {
        templateUrl: 'browser/js/templates/spelling-bee-puzzle.html', 
        restrict: 'E',
        scope:{
            letters:'='
        }
    };
});
