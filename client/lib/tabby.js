angular.module('tabby', []);

angular.module('tabby').directive('tabby', function() {

	var insertAt = function (textArea, value) {
		var node = angular.element(textArea);
		node.val(node.val().substring(0, textArea.selectionStart) + value + node.val().substring(textArea.selectionEnd));
	}

	return {
		restrict: 'A',
		link: function(scope, elem, attrs) {
			elem.bind('keydown', function(e) {
				// TAB Key
				if (e.keyCode === 9) {
					e.preventDefault();
					var start = this.selectionStart;
					insertAt(this, "\t");
					this.selectionStart = this.selectionEnd = start + 1;
					return;
				}

        // Removing this because it overrides the autosize stuff
				// ENTER key
				// if (e.keyCode === 13) {
				// 	var curLine = this.value.substr(0, this.selectionStart).split("\n").pop();
				// 	var numStartTabs = curLine.match(/^\t*/).shift().length;
				// 	var that = this;
        //
				// 	if (numStartTabs) {
				// 		e.preventDefault();
				// 		var insert = "\n";
				// 		var start = that.selectionStart;
        //
				// 		while (numStartTabs > 0) {
				// 			insert += "\t";
				// 			numStartTabs--;
				// 		}
        //
				// 		insertAt(that, insert);
				// 		that.selectionStart = that.selectionEnd = start + insert.length;
				// 	}
				// }
			})
		}
	}
});
