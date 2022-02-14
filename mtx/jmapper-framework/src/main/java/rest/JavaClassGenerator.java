package rest;

import com.sun.codemodel.JCodeModel;
import com.sun.tools.xjc.api.S2JJAXBModel;
import com.sun.tools.xjc.api.SchemaCompiler;
import com.sun.tools.xjc.api.XJC;
import org.xml.sax.InputSource;

import javax.tools.JavaCompiler;
import javax.tools.ToolProvider;
import java.io.File;
import java.io.IOException;
import java.io.StringReader;
import java.net.URL;
import java.net.URLClassLoader;

public final class JavaClassGenerator {

    public static void generateXMLClasses(String content,String dir) throws Exception {
        SchemaCompiler sc = XJC.createSchemaCompiler();
        sc.forcePackageName(dir);
        // Setup SAX InputSource
        InputSource is = new InputSource( new StringReader( content ) );
        is.setSystemId("id");
        // Parse & build
        sc.parseSchema(is);
        S2JJAXBModel model = sc.bind();
        JCodeModel jCodeModel = model.generateCode(null, null);
        jCodeModel.build(new File("./resources/xml"));

        File objectFactory = new File("./resources/xml/"+dir+"/ObjectFactory.java");
   
        objectFactory.delete();

    }
}
