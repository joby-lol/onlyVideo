module.exports = function(grunt) {
	require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);
	grunt.initConfig({
		pkg:grunt.file.readJSON('package.json'),

		uglify: {
			options:{
				banner: '/*!\n<%=pkg.name%> <%=pkg.version%> (<%=grunt.template.today("yyyy-mm-dd")%>)\n<%=pkg.homepage%>\nLicense: <%=pkg.license%>\n\n<%=pkg.licenseText%>\n*/\n'
			},
			build: {
				files: {
					'onlyVideo.min.js':[
						'source/js/onlyVideo.js'
					]
				}
			}
		},

		cssmin: {
			build: {
				files: {
					'onlyVideo.min.css':[
						'source/css/*'
					]
				}
			}
		},

		watch: {
			js: {
				files:[
					'source/js/*'
				],
				tasks:['uglify']
			},
			css: {
				files:['source/css/*'],
				tasks:['cssmin']
			}
		}

	});

	//default tasks
	grunt.registerTask('default',['uglify','cssmin']);
}