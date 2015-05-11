/**
 * Copyright 2015 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
/*jshint node: true*/
module.exports = function (grunt) {
   'use strict';

   var pkg = grunt.file.readJSON( 'package.json' );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   var banner = '/** Copyright 2015 aixigo AG, Released under the MIT license: http://laxarjs.org/license */';

   // mark dependencies that will be satisfied by other bundles
   var DEFER = 'empty:';

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   var base = {
      baseUrl: 'bower_components',
      name: pkg.name,
      packages: [ {
         name: pkg.name,
         location: pkg.name,
         main: pkg.name
      } ],
      exclude: [ 'text', 'json' ],
      paths: {
         text: 'requirejs-plugins/lib/text',
         json: 'requirejs-plugins/src/json',

         'jjv': DEFER,
         'jjve': DEFER,

         'angular': DEFER,
         'angular-mocks': DEFER,
         'angular-route': DEFER,
         'angular-sanitize': DEFER,

         'laxar-path-root': DEFER,
         'laxar-path-layouts': DEFER,
         'laxar-path-pages': DEFER,
         'laxar-path-widgets': DEFER,
         'laxar-path-themes': DEFER,
         'laxar-path-flow': DEFER
      },
      out: 'dist/' + pkg.name,
      optimize: 'none',
      generateSourceMaps: false
   };

   // internal dependencies:
   var fullPaths = options( {
      jjv: 'jjv/lib/jjv',
      jjve: 'jjve/jjve'
   }, base.paths );

   // widget testing dependencies:
   var testingPaths = options( {
      jquery: 'jquery/dist/jquery',
      jasmine: 'jasmine/lib/jasmine-core/jasmine',
      q_mock: 'q_mock/q'
   }, fullPaths );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   grunt.initConfig( {
      requirejs: {
         options: base,

         // Just LaxarJS itself, no dependencies
         // Allows (and requires) you to configure all dependencies yourself.
         'default': {
            options: {
               out: base.out + '.js'
            }
         },

         // LaxarJS, with all dependencies
         'with-deps': {
            options: {
               paths: fullPaths,
               out: base.out + '.with-deps.js'
            }
         },

         // LaxarJS testing, with all dependencies plus jQuery
         'testing': {
            options: {
               name: base.name + '/laxar_testing',
               paths: testingPaths,
               deps: [ 'jquery' ],
               out: base.out + '_testing.js'
            }
         }
      },

      // For the non-testing bundles, create minified versions as well:
      uglify: {
         options: {
            sourceMap: true,
            banner: banner
         },

         'default': {
            files: {
               'dist/laxar.min.js': [ 'dist/laxar.js' ]
            }
         },

         'with-deps': {
            files: {
               'dist/laxar.with-deps.min.js': [ 'dist/laxar.with-deps.js' ]
            }
         }
      }
   } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   grunt.loadNpmTasks( 'grunt-contrib-jshint' );
   grunt.loadNpmTasks( 'grunt-contrib-uglify' );
   grunt.loadNpmTasks( 'grunt-laxar' );

   grunt.registerTask( 'dist', [ 'requirejs', 'uglify' ] );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function options( source, defaults ) {
      var target = {};
      [ defaults, source ].forEach( function( src ) {
         for( var key in src ) {
            if( src.hasOwnProperty( key ) ) {
               target[ key ] = src[ key ];
            }
         }
      } );
      return target;
   }
};
