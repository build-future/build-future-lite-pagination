[![SimpleTemplate@BuildFuture](https://github.com/samuelzuuka/buildfuture-simple-template.git)]
=========================================================================================================================================================

### a Simple Project Template integrated with sass,grunt,bower and a static server with 'npm connect'
    
    SimpleTemplate@BuildFuture offers a simple grunt-cored auto workflow project, which listens source file changes and lively update .

### Hierarchy of Projects

    --bower_components     // bower libraries
    --dest                 // runtime directory, which is generated and maintained by grunt
        --[.tmp]                                           # temp compile file
        --css                                              # project css folder
        --font                                             # project level font folder
        --html                                             # html subpages 
        --imgs                                             # images ,icons,svgs
        --js                                               # project js folder
        --lib                                              # libraries from external, as zepto,jQuery,Bootstrap 
        --index.html                                       # main html page
    --node_modules         // node components
    --src                  // source codes, where put your source codes
        --font                                             # font sources 
        --html                                             # html pages 
        --imgs                                             # image type assets
        --js                                               # js sources
        --lib                                              # external / third-party libs 
        --sass                                             # sass folders 
        --index.html                                       # main page 
    --.jshintrc            // jshint config
    --bower.json           // bower config, preset bower dependencies
    --Gruntfile.js         // grunt config file
    --package.json         // package meta
    --Readme.md            // readme file
    --start.bat            // starter under windows / xp
    --start.sh             // starter under unix* / linux*

### Automating Process

    1. copy multiple sources to dest directory , from sources codes , bower_components and other libs , which is configured in grunt
    2. compile from sass / scss to css
    3. concat all .css files into a combine file all.css, concat all .js files into a combined file all.js; (library not included)
    4. unglify all.js to all.min.js, cssmin all.css to all.min.css
    5. minify html files




`@BuildFuture` aims to make it better,more effective, easier to build projects.
