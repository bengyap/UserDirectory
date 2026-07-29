using Microsoft.EntityFrameworkCore;
using UserDirectoryApi.Models;

namespace UserDirectoryApi.Data;

public class UserDirectoryDbContext : DbContext
{
    public UserDirectoryDbContext(DbContextOptions<UserDirectoryDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
}
