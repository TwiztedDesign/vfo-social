
angular.module('socialApp')

    .directive('timeInput', function() {
        return {
            restrict        :'E',
            template        : '<input type="text"/>',
            replace         : true,
            scope           : {
                value       : '='
            },
            link            : function(scope, element){
                Inputmask({"mask": "99:99:99"}).mask(element[0]);

                function format(seconds){
                    return new Date(seconds * 1000).toISOString().substr(11, 8);
                }
                function parse(hhmmss){
                    if(!hhmmss) return 0;
                    let split = hhmmss.split(":");
                    return (+split[0]) * 60 * 60 + (+split[1]) * 60 + (+split[2]);
                }

                element[0].value = format(scope.value);

                scope.$watch('value', (value) => {
                    element[0].value = format(value);
                });

                element[0].addEventListener('input', () => {
                    scope.value = parse(element[0].value);
                    scope.$apply();
                });
            }
        };
    })
;