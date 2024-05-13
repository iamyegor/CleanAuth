using System.Reflection;
using Dapper;

namespace Application.Utils;

public class DapperConfiguration
{
    public static void ConfigureSnakeCaseMapping()
    {
        Type[] types = Assembly.GetExecutingAssembly().GetTypes();
        foreach (Type model in types)
        {
            SqlMapper.SetTypeMap(
                model,
                new CustomPropertyTypeMap(
                    model,
                    (modelType, columnName) =>
                        modelType
                            .GetProperties()
                            .FirstOrDefault(prop => prop.Name.ToSnakeCase() == columnName)!
                )
            );
        }
    }
}
