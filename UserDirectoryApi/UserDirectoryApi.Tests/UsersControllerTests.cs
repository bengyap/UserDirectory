using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UserDirectoryApi.Controllers;
using UserDirectoryApi.Data;
using UserDirectoryApi.Models;
using UserDirectoryApi.Services;
using NUnit.Framework;

namespace UserDirectoryApi.Tests;

public class UsersControllerTests
{
    private static UserDirectoryDbContext CreateContext(string databaseName)
    {
        var options = new DbContextOptionsBuilder<UserDirectoryDbContext>()
            .UseInMemoryDatabase(databaseName)
            .Options;

        return new UserDirectoryDbContext(options);
    }

    [Test]
    public async Task GetUsers_ReturnsUsersOrderedByName()
    {
        await using var context = CreateContext(nameof(GetUsers_ReturnsUsersOrderedByName));
        context.Users.AddRange(
            new User { Name = "Zoe", Age = 30, City = "Austin", State = "TX", Pincode = "73301" },
            new User { Name = "Alice", Age = 25, City = "Dallas", State = "TX", Pincode = "75001" }
        );
        await context.SaveChangesAsync();

        var service = new UserService(context);
        var controller = new UsersController(service);

        var result = await controller.GetUsers();

        var users = result.Value;
        Assert.That(users, Is.Not.Null);
        Assert.That(users!.Select(u => u.Name), Is.EqualTo(new[] { "Alice", "Zoe" }));
    }

    [Test]
    public async Task GetUser_ReturnsNotFound_WhenMissing()
    {
        await using var context = CreateContext(nameof(GetUser_ReturnsNotFound_WhenMissing));
        var service = new UserService(context);
        var controller = new UsersController(service);

        var result = await controller.GetUser(404);

        Assert.That(result.Result, Is.TypeOf<NotFoundResult>());
    }

    [Test]
    public async Task CreateUser_ReturnsCreatedAtAction_WithNewUser()
    {
        await using var context = CreateContext(nameof(CreateUser_ReturnsCreatedAtAction_WithNewUser));
        var service = new UserService(context);
        var controller = new UsersController(service);
        var input = new User
        {
            Name = "Chris",
            Age = 28,
            City = "Denver",
            State = "CO",
            Pincode = "80201"
        };

        var result = await controller.CreateUser(input);

        Assert.That(result.Result, Is.TypeOf<CreatedAtActionResult>());
        var createdResult = (CreatedAtActionResult)result.Result!;
        Assert.That(createdResult.ActionName, Is.EqualTo(nameof(UsersController.GetUser)));

        Assert.That(createdResult.Value, Is.TypeOf<User>());
        var createdUser = (User)createdResult.Value!;
        Assert.That(createdUser.Id, Is.GreaterThan(0));
        Assert.That(createdUser.Name, Is.EqualTo("Chris"));
    }

    [Test]
    public async Task UpdateUser_ReturnsBadRequest_WhenRouteIdDiffersFromPayload()
    {
        await using var context = CreateContext(nameof(UpdateUser_ReturnsBadRequest_WhenRouteIdDiffersFromPayload));
        var service = new UserService(context);
        var controller = new UsersController(service);

        var result = await controller.UpdateUser(1, new User
        {
            Id = 2,
            Name = "Mismatch",
            Age = 20,
            City = "City",
            State = "ST",
            Pincode = "1234"
        });

        Assert.That(result, Is.TypeOf<BadRequestResult>());
    }

    [Test]
    public async Task UpdateUser_ReturnsNoContent_WhenUserExists()
    {
        var databaseName = nameof(UpdateUser_ReturnsNoContent_WhenUserExists);
        await using (var seedContext = CreateContext(databaseName))
        {
            seedContext.Users.Add(new User
            {
                Name = "Before",
                Age = 31,
                City = "Boston",
                State = "MA",
                Pincode = "02108"
            });
            await seedContext.SaveChangesAsync();
        }

        await using var context = CreateContext(databaseName);
        var existingId = await context.Users.Select(user => user.Id).SingleAsync();

        var service = new UserService(context);
        var controller = new UsersController(service);

        var result = await controller.UpdateUser(existingId, new User
        {
            Id = existingId,
            Name = "After",
            Age = 31,
            City = "Boston",
            State = "MA",
            Pincode = "02108"
        });

        Assert.That(result, Is.TypeOf<NoContentResult>());
        var updated = await context.Users.FindAsync(existingId);
        Assert.That(updated, Is.Not.Null);
        Assert.That(updated!.Name, Is.EqualTo("After"));
    }

    [Test]
    public async Task DeleteUser_ReturnsNotFound_WhenUserDoesNotExist()
    {
        await using var context = CreateContext(nameof(DeleteUser_ReturnsNotFound_WhenUserDoesNotExist));
        var service = new UserService(context);
        var controller = new UsersController(service);

        var result = await controller.DeleteUser(999);

        Assert.That(result, Is.TypeOf<NotFoundResult>());
    }

    [Test]
    public async Task DeleteUser_RemovesUserAndReturnsNoContent()
    {
        await using var context = CreateContext(nameof(DeleteUser_RemovesUserAndReturnsNoContent));
        var existing = new User
        {
            Name = "Delete Me",
            Age = 40,
            City = "Miami",
            State = "FL",
            Pincode = "33101"
        };
        context.Users.Add(existing);
        await context.SaveChangesAsync();

        var service = new UserService(context);
        var controller = new UsersController(service);

        var result = await controller.DeleteUser(existing.Id);

        Assert.That(result, Is.TypeOf<NoContentResult>());
        Assert.That(await context.Users.AnyAsync(u => u.Id == existing.Id), Is.False);
    }
}
