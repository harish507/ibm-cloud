package com.mints.mtx.util;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.exceptions.JedisException;

public class JedisMain {

	
private static final String redisHost = "localhost";
private static final Integer redisPort = 6379;

private static JedisPool pool = null;

public JedisMain() {

	pool = new JedisPool(redisHost, redisPort);

}

public void addSets() {
String key = "members";
String member1 = "Sedarius";
String member2 = "Richard";
String member3 = "Joe";



Jedis jedis = pool.getResource();
try {
jedis.sadd(key, member1, member2, member3);

//after saving the data, lets retrieve them to be sure that it has really added in redis
Set<String> members = jedis.smembers(key);
	for (String member : members) {
		System.out.println(member);
}
} catch (JedisException e) {
//if something wrong happen, return it back to the pool

} finally {
///it's important to return the Jedis instance to the pool once you've finished using it

}
}

public void addJmapperHash(String key, Map <String, String>jmapperMap) {


	Jedis jedis = pool.getResource();
	try {
		//save to redis
		jedis.hmset(key, jmapperMap);
		


	} catch (JedisException e) {
		//if something wrong happen, return it back to the pool
		if (null != jedis) {
	
		}
	} finally{
		///it's important to return the Jedis instance to the pool once you've finished using it
		if (null != jedis) {

		}
	}
}


public Map<String, String> getJmapperHash(String key) {


	Jedis jedis = pool.getResource();
	Map<String, String> retrieveMap=null;
	try {
		//save to redis
		 retrieveMap = jedis.hgetAll(key);
		
	//	 System.out.println("jedis"+retrieveMap);

	} catch (JedisException e) {
		//if something wrong happen, return it back to the pool
		if (null != jedis) {
	
		}
	} finally{
		///it's important to return the Jedis instance to the pool once you've finished using it
		if (null != jedis) {

		}
	}
	return retrieveMap;
}


public void addHash() {
//add some values in Redis HASH
String key = "javapointers";
Map<String, String> map = new HashMap<>();
map.put("name", "Java Pointers");
map.put("domain", "www.javapointers.com");
map.put("description", "Learn how to program in Java");

Jedis jedis = pool.getResource();
try {
//save to redis
jedis.hmset(key, map);

//after saving the data, lets retrieve them to be sure that it has really added in redis
Map<String, String> retrieveMap = jedis.hgetAll(key);
for (String keyMap : retrieveMap.keySet()) {
System.out.println(keyMap + " " + retrieveMap.get(keyMap));
}

} catch (JedisException e) {
//if something wrong happen, return it back to the pool
if (null != jedis) {
	
}
} finally{
///it's important to return the Jedis instance to the pool once you've finished using it
if (null != jedis) {

}
}
}

public static void main(String[] args){
JedisMain main = new JedisMain();
main.addSets();
main.addHash();
}
}
