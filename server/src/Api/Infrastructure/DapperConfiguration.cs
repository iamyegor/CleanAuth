using Application;
using Dapper;

namespace Api.Infrastructure;

public class DapperConfiguration
{
    public static void ConfigureSnakeCaseMapping()
    {
        Type[] types = typeof(IApplication).Assembly.GetTypes();
        foreach (Type model in types)
        {
            SqlMapper.SetTypeMap(
                model,
                new CustomPropertyTypeMap(
                    model,
                    (type, columnName) =>
                        type.GetProperties()
                            .FirstOrDefault(prop => prop.Name.ToSnakeCase() == columnName)!
                )
            );
        }
    }
}
