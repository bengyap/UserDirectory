using Microsoft.EntityFrameworkCore;

namespace UserDirectoryApi.Data;

public static class DbInitializer
{
    public static void Initialize(UserDirectoryDbContext context)
    {
        context.Database.EnsureCreated();
    }
}
