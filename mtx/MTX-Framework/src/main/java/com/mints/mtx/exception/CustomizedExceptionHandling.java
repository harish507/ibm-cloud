package com.mints.mtx.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import com.mints.mtx.bean.ResponseModel;

@ControllerAdvice
public class CustomizedExceptionHandling extends ResponseEntityExceptionHandler {

    @ExceptionHandler(PathNotFoundException.class)
    public ResponseModel handleExceptions( PathNotFoundException exception, WebRequest webRequest) {
    	ResponseModel response = new ResponseModel();
        response.setErrorMessage("Path not Found");
        response.setResult("");
        response.setHttpStatus(HttpStatus.NOT_FOUND.getReasonPhrase());
     //   ResponseEntity<Object> entity = new ResponseEntity<>(response,HttpStatus.NOT_FOUND);
        return response;
    }
}