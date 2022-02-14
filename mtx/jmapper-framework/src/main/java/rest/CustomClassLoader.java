package rest;

import javassist.ClassPool;
import javassist.CtClass;
import javassist.NotFoundException;

import java.io.*;

public class CustomClassLoader extends ClassLoader{

    private static ClassPool pool;

    static {
        pool = ClassPool.getDefault();
        try {
            pool.insertClassPath("./resources/xml");
            pool.insertClassPath("com/googlecode/jmapper/");
        } catch (NotFoundException e) {
            e.printStackTrace();
        }
    }

    @Override
    public Class<?> findClass(String name) throws ClassNotFoundException {
        if(name.contains("Mapper")) {
            return handleMapperClass(name);
        }
       byte[] bt = loadClassData(name);
        if(bt==null){
            throw new ClassNotFoundException();
        }
        return defineClass(name.replace("/","."), bt, 0, bt.length);
    }

    private Class<?> handleMapperClass(String name) {
        try {
            CtClass ctClass = pool.get(name);
            Class<?> classMapper = ctClass.toClass();

            FileOutputStream fileOut = new FileOutputStream("./resources/xml/mapperObject");
            ObjectOutputStream objectOut = new ObjectOutputStream(fileOut);
            objectOut.writeObject(classMapper);
            objectOut.close();
            fileOut.close();

            return classMapper;
        } catch (Exception e) {
            FileInputStream file = null;
            ObjectInputStream in=null;
            try {
                file = new FileInputStream("./resources/xml/mapperObject");
                in = new ObjectInputStream(file);
                Class<?> classMapper  = (Class<?>)in.readObject();
                return classMapper;

            } catch (Exception fileNotFoundException) {
                fileNotFoundException.printStackTrace();
            }finally {
                try {
                    in.close();
                    file.close();
                } catch (Exception ioException) {
                    ioException.printStackTrace();
                }
            }

        }
        return null;
    }

    private byte[] loadClassData(String className) {
        try {
            InputStream is = new FileInputStream(new File("./resources/xml/"+className.replace(".","/")+".class"));

            ByteArrayOutputStream byteSt = new ByteArrayOutputStream();
            //write into byte
            int len =0;

            while((len=is.read())!=-1){
                byteSt.write(len);
            }
            return byteSt.toByteArray();
        } catch (Exception e) {
            return null;
        }
    }
}
