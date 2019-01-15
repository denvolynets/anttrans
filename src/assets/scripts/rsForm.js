(function($) {
	var defaults = {
		'type': 'default', // alphabet, numerical, phoneRU, email, password, password_сonfirmed, checkbox
		'minL': {
			'val': 3,
			'mess': 'Минимальная длина 3 символа'
		},
		'lang': false,
		'message': 'Заполните это поле',
		'confirm': false,
		'messForTypes': {
			'alphabet': 'Допускаются только буквы',
			'numerical': 'Допускаются только цифры',
			'phoneRU': 'Неверный код региона',
			'email': 'Введите корректный e-mail',
			'password_сonfirmed': 'Пароли не совпадают'
		},
		'parent': '.js-rsform__field'
	};

	const ONLOAD_FUNC = {
		'declOfNum': function(n, titles) { // окончания слов
			return titles[(n % 10 === 1 && n % 100 !== 11) ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2];
		},
		'userOptionsTypeOf': function(arr1, arr2) { // добавляем возможность задать опции, как строкой так и объектом
			if (!arr2) {
				arr2 = arr1;
			}

			for (var option in arr1) {
				if (arr2[option] !== undefined) {
					if (typeof arr1[option] === 'object') {
						if (typeof arr2[option] === 'object') {
							arr1[option] = arr2[option];
						} else {
							arr1[option]['val'] = arr2[option];

							if (option === 'minL') {
								arr1[option]['mess'] = 'Минимальная длина ' + arr2[option] + ' ' + ONLOAD_FUNC.declOfNum(arr2[option], ['символ', 'символа', 'символов']);
							}
						}
					} else {
						arr1[option] = arr2[option];
					}
				}
			}
			return arr1;
		}
	};

	const METHODS = {
		initForm: function() {
			this.each(function() {
				var THIS = $(this);
				var DATA_FORM = {
					'formID': THIS.attr('id'),
					'elemRequired': '[data-required]',
					'fieldValid': [],
					'formValid': false
				};
				var passConfirmed = [];

				THIS.find(DATA_FORM.elemRequired).each(function(index) {
					var EL = $(this);

					var inputVal = EL.val();

					var valToNum = inputVal.replace(/\D/g, '');

					var valTotext = inputVal.replace(/[0-9]/g, '');

					var valNumSplit = valToNum.split('');

					var inputData = EL.data('required');

					var inputAttrType = EL.attr('type');

					/* дефолтные опции */
					var inputOptions = jQuery.extend({}, defaults);
					inputOptions = ONLOAD_FUNC.userOptionsTypeOf(inputOptions, inputData);
					/* -- дефолтные опции -- */

					/* дефолтные события при инициализации */
					DATA_FORM.fieldValid[index] = {
						'value': inputVal,
						'state': false,
						'inputData': inputOptions
					};

					EL.attr('autocomplete', 'off').parents(inputOptions.parentField).first().addClass('required');
					if (inputOptions.message) EL.parent(inputOptions.parentField).append('<span class="rsform-hint">' + inputOptions.message + '</span>');
					/* -- дефолтные события при инициализации -- */

					/* ОСНОВНАЯ ФУНКЦИЯ ОБРАБОТКИ ЭЛЕМЕНТА */
					EL.on('input keydown change', function(event) {
						inputVal = EL.val();
						valToNum = inputVal.replace(/\D/g, '');
						valTotext = inputVal.replace(/[0-9]/g, '');
						valNumSplit = valToNum.split('');

						if (inputOptions.type === 'email') {
							EL_FUNC.checkValue(EL_FUNC.checkEmail(inputVal));
						} else if (inputOptions.type === 'alphabet' || inputOptions.type === 'numerical') {
							EL_FUNC.alphabetORnumerical(inputOptions.type);

							EL_FUNC.checkValue(inputVal.length >= inputOptions.minL.val);
						} else if (inputOptions.type === 'phoneRU') {
							EL_FUNC.checkValue(valToNum.length >= 12 && valNumSplit[1] === '9');
						} else if (inputAttrType === 'checkbox' || inputOptions.type === 'checkbox') {
							EL_FUNC.checkValue(EL.prop('checked'));
						} else if (inputOptions.type === 'password') {
							EL_FUNC.checkValue(EL_FUNC.checkPassword());
							
							if (inputOptions.confirm) {
								if ($(inputOptions.confirm).length === 0) {
									$.error('Элемент ' + inputOptions.confirm + ' не найден для jQuery.rsForm');
									return;
								}

								passConfirmed[0] = inputVal;
								if (EL_FUNC.checkPassword()) {
									$(inputOptions.confirm).trigger('input');
								}
							}
						} else if (inputOptions.type === 'password_сonfirmed') {
							passConfirmed[1] = inputVal;
							EL_FUNC.checkValue(passConfirmed[0] === passConfirmed[1] && passConfirmed[0].length !== 0 && passConfirmed[1].length !== 0);
						} else if (inputOptions.type === 'radio') {
							EL_FUNC.checkValue(EL.find('[type="radio"]').is(':checked'));
						} else if (inputOptions.type === 'select' || inputAttrType === 'select') {
							EL_FUNC.checkValue(inputVal);
						} else {
							EL_FUNC.checkValue(inputVal.length >= inputOptions.minL.val);
						}

						/* ввод кирилици/латницицы */
						if (inputOptions.lang) EL_FUNC.translateLang(inputVal, inputOptions.lang);
						/* -- ввод кирилици/латницицы -- */
					});
					/* -- ОСНОВНАЯ ФУНКЦИЯ ОБРАБОТКИ ЭЛЕМЕНТА -- */

					/* если значение input пустое, то при blur убираем сообщение об ошибке */
					EL.on('blur', function() {
						if (inputVal.length === 0) {
							EL.parents(inputOptions.parentField).removeClass('error');
						}
					});
					/* -- если значение input пустое, то при blur убираем сообщение об ошибке -- */

					/* пользовательские функции */
					const EL_FUNC = {
						'hintMessage': function(mess) {
							if (mess) {
								EL.siblings('.rsform-hint').text(mess);
							} else {
								EL.siblings('.rsform-hint').text(inputOptions.message); // если параметр mess пустой, то выводим дефолтное сообщение из data-required
							}
						},
						'checkValue': function(check) {
							/* дополнительные сообщения об ошибках при определенных условиях */
							if (inputOptions.type === 'email') {
								if (inputVal.length > 0) {
									EL_FUNC.hintMessage(inputOptions.messForTypes[inputOptions.type]);
								} else {
									EL_FUNC.hintMessage();
								}
							} else if (inputOptions.type === 'alphabet') {
								if (event.keyCode >= 48 && event.keyCode <= 57) {
									EL_FUNC.hintMessage(inputOptions.messForTypes[inputOptions.type]);
								} else {
									if (event.keyCode) {
										EL_FUNC.hintMessage();
									}
								}
							} else if (inputOptions.type === 'numerical') {
								if (event.keyCode >= 65 && event.keyCode <= 90) {
									EL_FUNC.hintMessage(inputOptions.messForTypes[inputOptions.type]);
								} else {
									if (event.keyCode) {
										EL_FUNC.hintMessage();
									}
								}
							} else if (inputOptions.type === 'phoneRU') {
								if (valNumSplit[1] === '9') {
									EL_FUNC.hintMessage();
								} else {
									if (valToNum.length !== 0) {
										EL_FUNC.hintMessage(inputOptions.messForTypes[inputOptions.type]);
									} else {
										EL_FUNC.hintMessage();
									}
								}
							} else if (inputOptions.type === 'password') {
								if (typeof inputOptions.minL === 'object') {
									if (inputVal.length >= inputOptions.minL.val) {
										EL_FUNC.hintMessage();
									} else {
										if (valToNum.length !== 0) {
											EL_FUNC.hintMessage(inputOptions.minL.mess);
										} else {
											EL_FUNC.hintMessage();
										}
									}
								}
							} else if (inputOptions.type === 'password_сonfirmed') {
								if (passConfirmed[0] === passConfirmed[1]) {
									EL_FUNC.hintMessage();
								} else {
									if (passConfirmed[1].length > 0) {
										EL_FUNC.hintMessage(inputOptions.messForTypes[inputOptions.type]);
									} else {
										EL_FUNC.hintMessage();
									}
								}
							}
							/* -- дополнительные сообщения об ошибках при определенных условиях -- */

							/* добавляем/убираем класс результата обработки и добавляем соотв. значение в DATA_FORM */
							if (check) {
								DATA_FORM.fieldValid[index] = {
									'value': inputVal,
									'state': true,
									'inputData': inputOptions
								};
								EL.parents(inputOptions.parentField).first().addClass('success').removeClass('error');
							} else {
								EL.parents(inputOptions.parentField).first().addClass('error').removeClass('success');
								DATA_FORM.fieldValid[index] = {
									'value': inputVal,
									'state': false,
									'inputData': inputOptions
								};
							}

							EL_FUNC.setFormValid(false, DATA_FORM.fieldValid);
							THIS.data('DATA_FORM', DATA_FORM);
							/* -- добавляем/убираем класс результата обработки и добавляем соотв. значение в DATA_FORM -- */
						},
						'checkEmail': function(email) {
							var re = /\S+@\S+\.\S+/;
							return re.test(email);
						},
						'checkPassword': function() {
							return inputVal.length >= inputOptions.minL.val;
						},
						'translateLang': function(str, lang) {
							var ru = {
								'"': '@', 'q': 'й', 'w': 'ц', 'e': 'у', 'r': 'к', 't': 'е', 'y': 'н', 'u': 'г', 'i': 'ш', 'o': 'щ', 'p': 'з', '[': 'х', ']': 'ъ', 'a': 'ф', 's': 'ы', 'd': 'в', 'f': 'а', 'g': 'п', 'h': 'р', 'j': 'о', 'k': 'л', 'l': 'д', ';': 'ж', "'": 'э', 'z': 'я', 'x': 'ч', 'c': 'с', 'v': 'м', 'b': 'и', 'n': 'т', 'm': 'ь', ',': 'б', '.': 'ю', '/': '.'
							};

							var eng = {
								'"': '@'
							};

							var replace;

							if (lang === 'ru') {
								lang = ru;
							} else if (lang === 'eng') {
								lang = eng;
							} else {
								return false;
							}

							for (var key in ru) {
								eng[ru[key]] = key;
							}
							eng['.'] = '.';
							eng['/'] = '.';

							for (var i = 0; i < str.length; i++) {
								if (lang[str[i].toLowerCase()] !== undefined) {
									if (str[i] === str[i].toLowerCase()) {
										replace = lang[str[i].toLowerCase()];
									} else if (str[i] === str[i].toUpperCase()) {
										replace = lang[str[i].toLowerCase()].toUpperCase();
									}

									str = str.replace(str[i], replace);
								}
							}

							EL.val(str);
							inputVal = EL.val();
						},
						'alphabetORnumerical': function(type) {
							if (type === 'alphabet') {
								EL.val(valTotext);
							} else if (type === 'numerical') {
								EL.val(valToNum);
							}
							inputVal = EL.val();
						},
						'setFormValid': function(value, array) {
							var result = array.filter(function(el) {
								return !el.state;
							});

							if (result.length > 0) {
								DATA_FORM.formValid = false;
							} else {
								DATA_FORM.formValid = true;
							}
						}
					};
					/* -- пользовательские функции -- */
				});

				THIS.submit(function(e) {
					e.preventDefault();
					THIS.find(DATA_FORM.elemRequired).trigger('input');
				});
			});
		},
		getDataForm: function() {
			return this.data('DATA_FORM').formValid; // метод $(selector).getDataForm() - возвращает статус валидации всей формы TRUE или FALSE
		}
	};

	$.fn.rsForm = function(options, method) {
		if (options !== 'method') {
			options = ONLOAD_FUNC.userOptionsTypeOf(options);
			$.extend(defaults, options);
		}

		if (METHODS[method]) {
			return METHODS[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return METHODS.initForm.apply(this, arguments);
		} else {
			$.error('Метод с именем ' + method + ' не существует для jQuery.rsForm');
		}
	};
})(jQuery);
