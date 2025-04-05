const fastify = require('fastify')({logger: true});
const stdlibStringFunctions = require('@stdlib/string');
const fastifyFormBody = require('@fastify/formbody');
const fastifyStatic = require('@fastify/static');
const fs = require('fs');
const path = require('path');

fastify.register(fastifyFormBody);
fastify.register(fastifyStatic, { 
    root: path.join(__dirname), 
});

fastify.get('/', async (req, res) => {
    const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');
    // const clearedHtml = html
    //     .replace(`<input type="text" name="inputText" id="inputText" value="${request.body?.inputText || ''}"/>`, `<input type="text" name="inputText" id="inputText" />`)
    //     .replace(`<textarea name="convertedSentence" id="converted-sentence">${request.body?.convertedSentence || 'Output'}</textarea>`, `<textarea name="convertedSentence" id="converted-sentence">Output</textarea>`);
    res.type('text/html').send(html);
});

fastify.post('/convert', async (req, res) => {
    const inputText = req.body.inputText;
    const conversionType = req.body.conversion;

    let convertedText = "";

    if(!inputText){
        convertedText = "Please enter some text";
    }else{
        switch(conversionType){
            case "camelCase":
                convertedText = stdlibStringFunctions.camelcase(inputText);
                break;
            case "upperCase":
                convertedText = stdlibStringFunctions.uppercase(inputText);
                break;
            case "lowerCase":
                convertedText = stdlibStringFunctions.lowercase(inputText);
                break;
            case "headerCase":
                convertedText = stdlibStringFunctions.headercase(inputText);
                break;
            case "pascalCase":
                convertedText = stdlibStringFunctions.pascalcase(inputText);
                break;
            case "startCase":
                convertedText = stdlibStringFunctions.startcase(inputText);
                break;
            case "kebabCase":
                convertedText = stdlibStringFunctions.kebabcase(inputText);
                break;
            default:
                convertedText = "Invalid type";
        }
    }

    const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8').replace(`<input type="text" name="inputText" id="inputText" />`, `<input type="text" name="inputText" id="inputText" value="${inputText}"/>`)
    .replace(`<textarea name="convertedSentence" id="converted-sentence"></textarea>`, `<textarea name="convertedSentence" id="converted-sentence">${convertedText}</textarea>`);

    res.type('text/html').send(html);
    
});

const start = async () => {
    try{
        await fastify.listen({ port: 2003 });
        fastify.log.info(`Server listening on ${fastify.server.address().port}`);
    }catch(err){
        fastify.log.error(err);
        process.exit(1);
    }
};

start();