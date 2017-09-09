'use strict'
app.directive('modal', function(){
    return {
        templateUrl: 'browser/js/templates/modal.html', 
        restrict: 'E',
        transclude: true,
        replace:true,
        scope:{
            visible:'=', 
            onShow:'&', 
            onHide:'&'
        },   
        link: function (scope, element, attrs){

            $(element).modal({
                show: false, 
                keyboard: attrs.keyboard, 
                backdrop: attrs.backdrop
            });

            scope.$watch(function(){return scope.visible;}, function(value){
                if(value == true){
                    $(element).modal('show');
                }else{
                    $(element).modal('hide');
                }
            });

            $(element).on('shown.bs.modal', function(){
              scope.$apply(function(){
                scope.$parent[attrs.visible] = true;
              });
            });

            $(element).on('shown.bs.modal', function(){
              scope.$apply(function(){
                  scope.onShow({});
              });
            });

            $(element).on('hidden.bs.modal', function(){
              scope.$apply(function(){
                scope.$parent[attrs.visible] = false;
              });
            });

            $(element).on('hidden.bs.modal', function(){
              scope.$apply(function(){
                  scope.onHide({});
              });
            });
        }
    };
});

app.directive('modalHeader', function(){
    return {
        template:'<div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title">{{title}}</h4></div>',
        replace:true,
        restrict: 'E',
        scope: {title:'@'}
    };
});

app.directive('modalBody', function(){
    return {
        template:'<div class="modal-body" ng-transclude></div>',
        replace:true,
        restrict: 'E',
        transclude: true
    };
});

app.directive('modalFooter', function(){
    return {
        template:'<div class="modal-footer" ng-transclude></div>',
        replace: true,
        restrict: 'E',
        transclude: true
    };
});