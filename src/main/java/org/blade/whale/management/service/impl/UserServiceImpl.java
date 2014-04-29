package org.blade.whale.management.service.impl;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.dbutils.ResultSetHandler;
import org.blade.whale.management.service.UserService;
import org.blade.whale.model.UserVO;
import org.blade.whale.util.DBUtils;

public class UserServiceImpl implements UserService {

	private static final String INSERT_USER_SQL = "insert into user (username, password, issuperadmin) values(?, ?, ?)";
	private static final String LIST_USERS_SQL = "select username,  issuperadmin from user";
	private static final String LIST_USER_SQL = "select username, password, issuperadmin from user where username='";
	private static final String DELETE_USER_SQL = "delete from user where username='";

	@Override
	public void addUser(UserVO user) throws SQLException {
		Object[] param = new Object[3];
		String userName = user.getUserName();
		param[0] = userName;

		boolean result = (Boolean) DBUtils.query(
				LIST_USER_SQL + userName + "'", new ResultSetHandler() {
					@Override
					public Boolean handle(ResultSet rs) throws SQLException {
						if (rs.next()) {
							return true;
						} else {
							return false;
						}
					}
				});
		if (result) {
			throw new SQLException("user[" + userName + "] already exist.");
		}
		param[1] = user.getPassword();
//		try {
//			MessageDigest md = MessageDigest.getInstance("MD5");
//			md.update(password.getBytes("UTF-8"));
//			param[1] = new String(md.digest());
//		} catch (NoSuchAlgorithmException e) {
//			throw new SQLException("Failed to add user.");
//		} catch (UnsupportedEncodingException e) {
//			throw new SQLException("Failed to add user.");
//		}
		param[2] = user.isSuperAdmin();
		Object[][] params = new Object[1][];
		params[0] = param;
		DBUtils.batch(INSERT_USER_SQL, params);
	}

	@Override
	public void deleteUser(UserVO user) throws SQLException {
		String userName = user.getUserName();
		DBUtils.update(DELETE_USER_SQL + userName + "'");
	}

	@Override
	public List<UserVO> getUsers() throws SQLException {
		final List<UserVO> users = new ArrayList<UserVO>();
		DBUtils.query(LIST_USERS_SQL, new ResultSetHandler() {
			@Override
			public Object handle(ResultSet rs) throws SQLException {
				while (rs.next()) {
					String userName = rs.getString(1);
					boolean isSuperAdmin = rs.getBoolean(2);
					UserVO user = new UserVO();
					user.setUserName(userName);
					user.setSuperAdmin(isSuperAdmin);
					users.add(user);
				}
				return null;
			}
		});
		return users;
	}

	@Override
	public boolean validateUser(UserVO user) throws SQLException {
		final String userName = user.getUserName();
		final String password = user.getPassword();
		boolean result = (Boolean) DBUtils.query(
				LIST_USER_SQL + userName + "'", new ResultSetHandler() {
					@Override
					public Boolean handle(ResultSet rs) throws SQLException {
						if (rs.next()) {
							String pwd = rs.getString(2);
							boolean su = rs.getBoolean(3);
//							try {
//								MessageDigest md = MessageDigest
//										.getInstance("MD5");
//								md.update(password.getBytes("UTF-8"));
//								String encryptedPwd = new String(md.digest());
								if (!pwd.equals(password)) {
									throw new SQLException("用户名或密码错误。");
								}
								return su;
//							} catch (NoSuchAlgorithmException e) {
//								throw new SQLException("Failed to validate user.");
//							} catch (UnsupportedEncodingException e) {
//								throw new SQLException("Failed to validate user.");
//							}
						}
						throw new SQLException("用户名不存在。");
					}
				});
		return result;
	}
}
