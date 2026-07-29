using Microsoft.EntityFrameworkCore;
using UserDirectoryApi.Data;
using UserDirectoryApi.Models;

namespace UserDirectoryApi.Services;

public interface IUserService
{
    Task<IEnumerable<User>> GetAllAsync();
    Task<User?> GetByIdAsync(int id);
    Task<User> CreateAsync(User user);
    Task<bool> UpdateAsync(int id, User user);
    Task<bool> DeleteAsync(int id);
    Task<bool> UserExistsAsync(int id);
}

public class UserService : IUserService
{
    private readonly UserDirectoryDbContext _context;

    public UserService(UserDirectoryDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<User>> GetAllAsync()
    {
        return await _context.Users
            .AsNoTracking()
            .OrderBy(u => u.Name)
            .ToListAsync();
    }

    public async Task<User?> GetByIdAsync(int id)
    {
        return await _context.Users.FindAsync(id);
    }

    public async Task<User> CreateAsync(User user)
    {
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return user;
    }

    public async Task<bool> UpdateAsync(int id, User user)
    {
        if (id != user.Id)
        {
            return false;
        }

        _context.Entry(user).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
        {
            return false;
        }

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> UserExistsAsync(int id)
    {
        return await _context.Users.AnyAsync(e => e.Id == id);
    }
}
