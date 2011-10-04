/**
 *
 * Url Hash Handler
 * Version: 1.0
 *
 * Monitorea window.location.hash
 *
 * Autor: Sahib Alejandro Jaramillo Leo
 * Site: http://sahibalejandro.com
 * GitHub: https://github.com/sahibalejandro/JavaScript-URL-Hash-Handler
 * Licence: GPL v3
 *
 */
function UrlHashHandler()
{
	this.interval = null;
	this.last_hash = '';
	this.HashData = {};
	this.callback = function()
	{
	};
}

/**
 * Con este metodo se inicializa el "monitoreo" de window.location.hash, e
 * invocara a callback cada que el hash sea modificado.
 *
 * Opcionalmente se puede definir un DefaulHashData que será utilizado si
 * window.location.hash esta vacio.
 */
UrlHashHandler.prototype.init = function(callback, DefaultHashData)
{
	this.callback = callback;

	if(window.location.hash == '' && DefaultHashData) {
		this.setHash(DefaultHashData);
	}

	this.startChecking();
}
/**
 * Inicia el intervalo de monitoreo
 */
UrlHashHandler.prototype.startChecking = function()
{
	var that = this;

	/*
	 * Este intervalo es para verificar modificaciones en window.location.hash
	 */
	this.interval = setInterval(function()
	{
		if(that.last_hash != window.location.hash) {

			/*
			 * El window.location.hash ha cambiado, es hora de leer
			 * el hash e invocar el callback con los argumentos leidos.
			 */
			that.last_hash = window.location.hash;

			/*
			 * Convertir string hash a objeto, para enviarselo al callback.
			 */
			var hash_vars = that.last_hash.substring(1).split('&');
			for(i in hash_vars ) {
				var var_parts = hash_vars[i].split('=');
				that.HashData[var_parts[0]] = var_parts[1];
			}

			/*
			 * Invocar callback con los datos del hash
			 */
			that.callback(that.HashData);
		}
	}, 100);
}
/**
 * Detiene el intervalo de monitoreo.
 */
UrlHashHandler.prototype.stopChecking = function()
{
	clearInterval(this.interval);
}
/**
 * Cambia el window.location.hash por el HashData especificado, opcionalmente se
 * puede cambiar solo un valor del hash especificando como primer argumento el
 * key y como se gundo argumento el valor.
 */
UrlHashHandler.prototype.setHash = function(HashData, value)
{
	var hash_vars = [];

	/* Cambiar solo un valor en el hash actual? */
	if( typeof HashData == 'string') {
		this.HashData[HashData] = value;
		HashData = this.HashData;
	}

	for(key in HashData ) {
		hash_vars.push(key + '=' + encodeURIComponent(HashData[key]));
	}

	/*
	 * Establecemos el hash de window.location, la funcion del intervalo
	 * en el mentodo startChecking se encargará de verificar los cambios
	 * en el hash e invocar el callback si estos existen.
	 */
	window.location.hash = hash_vars.join('&');
}

/*
 * Devuelve un objeto del ultimo hash leido en el monitoreo.
 */
UrlHashHandler.prototype.getHashData = function()
{
	return this.HashData;
}