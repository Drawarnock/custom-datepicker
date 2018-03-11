(function($) {
  
  $.fn.kwDatePicker = function(config) { 
	
	var pluginName = 'kwDatePicker';
	var instance = this.data(pluginName); // Find the plugin attached to the element
		
	if(!instance) { // If the instance wasn't found, create it...
		return this.each(function() { // Return the element being bound to
			return $(this).data(pluginName, new kwDatePicker(this, config));
		});
	}
      
	return (config === true) ? instance : this;	
	};
	
	$.fn.kwDatePicker.defaults = {
		todayDate: new Date(),
		firstDate: null,
		monthNamesPL: ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień','Wrzesień', 'Październik', 'Listopad', 'Grudzień'],
		shortMonthNamesPL: ['Stycz.',' Luty', 'Mar.', 'Kwiec.', 'Maj', 'Czerw.', 'Lip.', 'Sierp.', 'Wrzes.', 'Paźdz.', 'Listop.', 'Grudz.'],
		monthNamesEN: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August','September', 'October', 'November', 'December'],
		shortMonthNamesEN: ['Jan.', 'Feb.' , 'Mar.', 'Apr.', 'May', 'June', 'July', 'Aug.', 'Sept.', 'Oct.' , 'Nov.', 'Dec.'],
		dayNamesPL: ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So','Nd'],
		dayNamesEN: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun' ],
		language: 'PL',
		dowOffset:true
	};
	
	var kwDatePicker = (function() {
		
		function kwDatePicker(inputElement, customOptions) { // constructor function
			var that = this; // create reference to this object
			this.el = $(inputElement); // input element as attribute of object
			this.options = $.extend(true, {}, $.fn.kwDatePicker.defaults, customOptions); // Merge user options into default options
			this.calendar = $($.find('[kwdp-el=' + this.el.attr('kwdp-id') + ' ]')); // find our container for calendar
			this.options.firstDate = (new Date((this.options.firstDate || this.options.todayDate))).setDate(1); //  assign first date of the month to the this.options.firstDate
		
				if(!(this.el.attr('kwdp-id') || '').length) {  // create a special atribute with unique value
				this.el.attr('kwdp-id', 'kwdp-' + Math.round(Math.random() * 1e10))
			}
		
			this.el.bind('click', function() { that.show(); }) // bind click to the element
                   .bind('focus', function()  { that.show(); }); // bind focus to the element
						
			$(document).on('mouseup', function(e) {
			if(!that.el.is(e.target) && !that.calendar.is(e.target) && that.calendar.has(e.target).length===0 ) 
            { that.hide(); } // hide calendar element if is not target
			});
			
			this.render();
		};
		
		kwDatePicker.prototype = { // prototypes object
			
			show: function() { // show calendar
				this.calendar.fadeIn();
                this.calendar.find('.calendar').fadeIn(); // show calendar window
                this.calendar.find('.months').hide(); //hide months window 
                this.calendar.find('.years').hide();  // hide // years window
			},
			
			hide: function () { // hide calendar
				this.calendar.fadeOut(); //fadeOut everything
                this.calendar.find('.calendar').fadeOut(); 
                this.calendar.find('.months').fadeOut(); 
                this.calendar.find('.years').fadeOut(); 
			},
            
			render: function() { // render method
			var that = this; //create reference to this object
			var calendar = that.calendar;
			var rows = 6; // rows in our calendar
			var cols = 7; // cols in our calendar
			var todayDate = this.options.todayDate.getDate(); 
			var todayDay = this.options.todayDate.getDay();  
			var currentMonth = this.options.todayDate.getMonth(); 
			var year = this.options.todayDate.getFullYear();
			var dayNames; // rendered day Names
			var monthNames;	 //rendered month Names
			var shortMonthNames;
			
			if(this.options.language.toUpperCase() === 'PL' || this.options.language.toUpperCase()!=='EN' ) { // check  if language is PL or is not a EN
				dayNames = this.options.dayNamesPL;
				monthNames = this.options.monthNamesPL;
				shortMonthNames = this.options.shortMonthNamesPL;
				if( this.options.language.toUpperCase()!=='EN' && this.options.language.toUpperCase()!=='PL') alert('Your choice of language in kwDatePicker is wrong. You can choose PL or EN, default language is PL')
			}
			else if(this.options.language.toUpperCase() === 'EN') { // check  if language is EN
				dayNames = this.options.dayNamesEN;
				monthNames = this.options.monthNamesEN;
				shortMonthNames = this.options.shortMonthNamesEN;
			}
			
			var leapYear = (year % 4 ===0) ? 1 : 0;
			var numberOfDays = [31, 28+leapYear, 31, 30, 31, 30, 31, 31,30, 31, 30, 31]; // number of days in each month
			
			if(!this.options.dowOffset) { // change Sun to the first day of the week if this.options.dowOffset is false
				var lastToFirst = dayNames.pop();
				dayNames.unshift(lastToFirst);
			}
			
			if(!this.calendar.length) { // check if this calendar exist
			that.calendar = calendar = $('<div/>') // reassing to this calendar
					.attr('kwdp-el', this.el.attr('kwdp-id')) // add attribute with unique value connected to input element
					.css({display: 'none'})	// add css property for hiding
			        .appendTo($('body')); // append calendar element to the body 
			}

			if(!this.el.is(':visible')) { calendar.hide(); } // if input element is not visible hide calendar element
			
				calendar.removeClass()
					    .addClass('cal')
					    .children().remove(); //remove children

			var $table = $('<table/>').addClass('calendar'); // create table and add class
			var $caption = $('<caption/>').addClass('navigation');  // create caption for table and add class
			calendar.append($table); // append table to the calendar element
			$table.append($caption, $(document.createElement('thead')), $(document.createElement('tbody'))); //apend caption, tbody and thead to the table
			var setPosition = function(el) { // set position element function
					
					var elPos = el.offset(); // sign x, y position el to the elPos variable
					calendar.css(
					{
						top: (elPos.top + that.el.outerHeight() + 1) + 'px', // set y coord el(calendar) 1px  below input
						left: elPos.left  + 'px' // set x coord el(calendar) equal  input
					});
				};	
				$(window).resize(setPosition.bind(this, this.el)); // add listener on resize with function setPosition
				setPosition(that.el); // call  function after load
				
			var setFirstDate = function(date) { // set month in calendar
					if(date) {
						that.options.firstDate = date;
						that.render();
					}
				};
			
			var getFirstDate = function(offset) { // get first date
				var date = new Date(that.options.firstDate); // date is current date 
				offset = offset || 0; // offset indicates how many month we will change date
				date.setMonth(date.getMonth() + offset); // setting date with offset
				date.setDate(1); // setting to first date of the month
				return date;
			}
			
			var prevFirstDate = getFirstDate(-1); // get previous month
			var nextFirstDate = getFirstDate(1); // get next month
			var firstDate = (this.options.firstDate = getFirstDate());

			function getStartDate(fd) { // Get the start date in the calendar
				var startDate = new Date(fd)
				var startDay = startDate.getDay();
				var startOffset = startDay - that.options.dowOffset ; // if that.options.dowOffset is 1 then first day of the week is Monday, else first day is Sunday
				startOffset = startOffset < 1 ? -7 - startOffset : -startOffset; // get number which indicates start Date in calendar
				startDate.setDate(startDate.getDate(firstDate) + startOffset); // set to start Date 
				return startDate; // startDate is a star Date which render in the first cell in the calendar
			}

			var startDate = getStartDate(firstDate); // call the function getStartDate()
			for(var i=0; i<3 ;i++) $caption.append($(document.createElement('span')));  // create 3 spans

			$caption.children(':first-child') 
					.addClass('navigation__button') // first span has class...
					.append(($(document.createElement('a'))) // and appending a element to span
						      .addClass('navigation__link navigation__link--button') // and adding class
						      .html('<i class="icon-left-big"></i>') // insert fontello
						      .mousedown(function() { return false; })
						      .click(function(e) { // event listener
							     e.preventDefault(); // prevent default behavior of element a
							     setFirstDate(prevFirstDate); // call the function with argument which indicates previous month
						      }));

			$caption.children(':nth-child(2)')
					.addClass('navigation__change')
					.append(($(document.createElement('a')))
						  .addClass('navigation__link navigation__link--title')
						  .html(monthNames[firstDate.getMonth()]+' '+ firstDate.getFullYear()) // set title with selected month and year
						  .click(function(e) {
                                $table.hide(); // hide calendar window
                                months.show(); // show months window
                                monthsBody.find('.months__item').on('click', function() {
								setFirstDate(firstDate.setMonth($(this).data('index'))); // set month on click as current choose month
                                });
                            }));
					
			$caption.children(':last-child')
					.addClass('navigation__button')
					.append(($(document.createElement('a')))
                            .addClass('navigation__link navigation__link--button')
                            .html('<i class="icon-right-big"></i>')
                            .mousedown(function() { return false; })
                            .click(function(e) {
                                e.preventDefault();
                                setFirstDate(nextFirstDate);
                            }));

			// day of the week
			$table.find('thead')
				  .append($('<tr/>')); // and tr element to thead

			for(var j=1;j<=cols;j++) {
				$table.find('thead')
					.find('tr')
					.append($('<th/>'))
					.children(':nth-child('+j+')')
					.html(dayNames[j-1]); // adding dayNames in thead
			}

			// date of the month
			for (var i=0;i<rows;i++) {
				$table.find('tbody')
					  .append($('<tr/>')); // appending tr elements in tbody
			}
				
			for(var i=0;i<cols;i++) {
				$table.find('tbody')
					  .find('tr')
					  .append($('<td/>')); // appending td elements i tr
			}
			
			$table.find('tbody')
				  .find('td')
				  .append($('<a/>'))
				  .children()
				  .addClass('calendar__link'); // add every a element which are in tbody class calendar__link
				
			var cells =	$table.find('tbody')
					          .find('a'); // get nodelist of every a element in tbody to the variable cells

			cells.each(function (index) { // loop for cells
				var cellDate = new Date(startDate); // start date for cell
				cellDate.setDate(cellDate.getDate()+index); // seDate for each cell
			
				$(this).data('data', { date: cellDate}) // transmit data which is date for each cell
					   .html(cellDate.getDate()); // insert date to the cell

				if($(this).data('data').date.getDate() === todayDate && $(this).data('data').date.getMonth() === currentMonth  && $(this).data('data').date.getFullYear() === year) // if date in cell is today
				{
					$(this).addClass('calendar__link--today'); // add class calendar__link--today
				}	
				
				if($(this).data('data').date.getMonth() == that.options.firstDate.getMonth() ) // if month is cells is current month 
				{
					$(this).addClass('calendar__link--on'); // add class calendar__link--on
				} else {
					$(this).addClass('calendar__link--off'); // else add class calendar__link--off
				}
			});	

			cells.on('click', function(e) { // add event listener for each cell
				e.preventDefault(); // prevent default behavior of element a
				$(this).addClass('calendar__link--selected'); // add class to clicked cell
				$.each(cells.not(this),function(index) { $(this).removeClass('calendar__link--selected') }); // remove class selected from every element which is not clicked
				var thisDate = $(this).data('data'); // collect date from this cell
				var dd = thisDate.date.getDate();
				if (dd<10) dd="0"+dd;
				var mm=(thisDate.date.getMonth()+1)
				if (mm<10) mm="0"+mm;
				var text = thisDate.date.getFullYear()+'-'+mm+'-'+dd; // get date in string
				that.el.val(text);  // insert value into input
				that.hide(); // and hide calendar
			});
			
		// creating window for months	
			var months = ($(document.createElement('div')))
						.addClass('months')
						.hide()
						.appendTo($(calendar));
							
			var monthsTitle = ($(document.createElement('div')))
							.addClass('months__title')
							.appendTo(months);
							
			var title = ($(document.createElement('a')))
						.addClass('months__year')
						.html(firstDate.getFullYear())
						.click(function(e) {
							e.preventDefault();
							months.hide();
							renderYears();
						});
									
			monthsTitle.append(title);
			var monthsBody = ($(document.createElement('div')))
							.addClass('months__body')
							.appendTo(months);
							
			for(var i =0;i<12;i++) {
			var month =	$(document.createElement('div'))
						.data('index', i)
						.addClass('months__item')
						.html(shortMonthNames[i])
						.appendTo(monthsBody) 
            }
                
			// end of creating window for months
			//creating window for years
			
			function renderYears() { 
			var years = ($(document.createElement('div')))
						.addClass('years')
						.appendTo($(calendar));
                     
			var yearsHead = ($(document.createElement('div')))
							.addClass('years__head')
							.appendTo(years);

			var prevYears = ($(document.createElement('a')))
							.addClass('years__previous')
							.html('<i class="icon-left-big"></i>')
							.click(function(e) {
								e.preventDefault();
								firstDate.setFullYear(firstDate.getFullYear()-9);
                                years.remove();
								renderYears();
							})
							.appendTo(yearsHead);

			var yearsTitle = ($(document.createElement('span')))
							.addClass('years__title')
							.appendTo(yearsHead);

			var nextYears = ($(document.createElement('a')))
							.addClass('years__next')
							.html('<i class="icon-right-big"></i>')
							.click(function(e) {
								e.preventDefault();
								firstDate.setFullYear(firstDate.getFullYear()+9);
                                years.remove();
								renderYears();
							})
							.appendTo(yearsHead);

			var lastTitle = ($(document.createElement('span')))
				.html((firstDate.getFullYear()-4) + "-" + (firstDate.getFullYear()+4))
				.appendTo(yearsTitle);

			var yearsBody = ($(document.createElement('div')))
							.addClass('years__body')
							.appendTo(years);

			for(var i=0;i<9;i++) {
				var year =	$(document.createElement('div'))
					.data('year', ((firstDate.getFullYear()-4)+i))
					.addClass('years__item')
					.html((firstDate.getFullYear()-4)+i)
					.appendTo(yearsBody);
				}

			yearsBody.find('.years__item').on('click', function() {
				firstDate.setFullYear($(this).data('year'));
                months.find('.months__year')
                      .html(firstDate.getFullYear());
				years.hide();
				months.show();
                }); // end of creating widnow for years
			}
		}
	};
		
	return kwDatePicker;
	
	})();
    
})(jQuery);