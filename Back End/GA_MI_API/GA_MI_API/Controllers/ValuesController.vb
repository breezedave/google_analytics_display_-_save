Imports System.Net
Imports System.Web.Http
Imports GA_MI_API.db
Imports Dapper

Public Class ValuesController
    Inherits ApiController

    ' GET api/values
    Public Function GetValues() As List(Of needLine)
        Dim str As List(Of needLine) = getNeedList()
        Return str
    End Function

    ' POST api/values
    Public Function PostValue(<FromBody()> ByVal value As String) As String
        Return "Ok"
    End Function

End Class
