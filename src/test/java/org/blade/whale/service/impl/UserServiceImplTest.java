package org.blade.whale.service.impl;

import static org.junit.Assert.*;

import java.sql.SQLException;
import java.util.List;

import org.blade.whale.management.service.UserService;
import org.blade.whale.management.service.impl.UserServiceImpl;
import org.blade.whale.model.UserVO;
import org.junit.Test;

public class UserServiceImplTest {

	@Test
	public void test1() throws SQLException{
		UserService us = new UserServiceImpl();
		UserVO user1 = new UserVO("admin", "admin", true);
		us.addUser(user1);
		List<UserVO> userList = us.getUsers();
		assertEquals(2, userList.size());
		UserVO result = userList.get(0);
		assertEquals("admin", result.getUserName());
		assertEquals(true, result.isSuperAdmin());
		boolean  result2 = us.validateUser(user1);
		assertTrue(result2);
//		us.deleteUser(user1);
//		userList = us.getUsers();
//		assertEquals(1, userList.size());
	}
	
	@Test
	public void test2() throws SQLException{
		UserService us = new UserServiceImpl();
		UserVO user1 = new UserVO("aaa", "aaa", false);
		us.addUser(user1);
		List<UserVO> userList = us.getUsers();
		assertEquals(1, userList.size());
		UserVO result = userList.get(0);
		assertEquals("aaa", result.getUserName());
		assertEquals(false, result.isSuperAdmin());
		boolean  result2 = us.validateUser(user1);
		assertFalse(result2);
//		us.deleteUser(user1);
//		userList = us.getUsers();
//		assertEquals(0, userList.size());
	}
	
}
